var buckets = new WeakMap();
var functionContextStack = [];

function createFunctionContext(...fns) {
  fns = fns.map(function mapper(fn) {
    contextFunction.name_ = fn.name;
    contextFunction.reset = reset;
    return contextFunction;



    function contextFunction(...args) {
      contextFunction.args_ = args
      functionContextStack.push(contextFunction);
      var bucket = getCurrentBucket();
      bucket.nextStateSlotIdx = 0;
      bucket.nextEffectIdx = 0;
      bucket.nextMemoizationIdx = 0;

      try {
        return fn.apply(this, args);
      } finally {
        try {
          runEffects(bucket);
        } finally {
          functionContextStack.pop();
        }
      }
    }

    function runEffects(bucket) {
      for (let [idx, [effect, guards]] of bucket.effects.entries()) {
        try {
          if (typeof effect == "function") {
            effect();
          }
        } finally {
          bucket.effects[idx][0] = undefined;
        }
      }
    }

    function reset() {
      functionContextStack.push(contextFunction);
      var bucket = getCurrentBucket();
      try {
        // run all pending cleanups
        for (let cleanup of bucket.cleanups) {
          if (typeof cleanup == "function") {
            cleanup();
          }
        }
      } finally {
        functionContextStack.pop();
        bucket.stateSlots.length = 0;
        bucket.effects.length = 0;
        bucket.cleanups.length = 0;
        bucket.memoizations.length = 0;
        bucket.nextStateSlotIdx = 0;
        bucket.nextEffectIdx = 0;
        bucket.nextMemoizationIdx = 0;
      }
    }
  });

  return fns.length < 2 ? fns[0] : fns;
}

function getCurrentBucket() {
  if (functionContextStack.length > 0) {
    let contextFunction = functionContextStack[functionContextStack.length - 1];
    let bucket;
    if (!buckets.has(contextFunction)) {
      bucket = {
        contextFunction: contextFunction,
        nextStateSlotIdx: 0,
        nextEffectIdx: 0,
        nextMemoizationIdx: 0,
        stateSlots: [],
        effects: [],
        cleanups: [],
        memoizations: [],
      };
      buckets.set(contextFunction, bucket);
    }

    return buckets.get(contextFunction);
  }
}

function state(initialVal) {
  var bucket = getCurrentBucket();
  if (bucket) {
    return reducer(function reducer(prevVal, vOrFn) {
      return typeof vOrFn == "function" ? vOrFn(prevVal) : vOrFn;
    }, initialVal);
  } else {
    throw new Error(
      "state() only valid inside a contexified function"
    );
  }
}

function reducer(reducerFn, initialVal, ...initialReduction) {
  var bucket = getCurrentBucket();
  if (bucket) {
    if (!(bucket.nextStateSlotIdx in bucket.stateSlots)) {
      let slot = [
        typeof initialVal == "function" ? initialVal() : initialVal,
        function updateSlot(v) {
          slot[0] = reducerFn(slot[0], v);
          bucket.contextFunction(...bucket.contextFunction.args_);
        },
      ];
      bucket.stateSlots[bucket.nextStateSlotIdx] = slot;

      if (initialReduction.length > 0) {
        bucket.stateSlots[bucket.nextStateSlotIdx][1](initialReduction[0]);
      }
    }

    return [...bucket.stateSlots[bucket.nextStateSlotIdx++]];
  } else {
    throw new Error(
      "reducer() only valid inside a contexified function."
    );
  }
}

function guardsChanged(guards1, guards2) {
  if (guards1 === undefined || guards2 === undefined) {
    return true;
  }

  if (guards1.length !== guards2.length) {
    return true;
  }


  for (let [idx, guard] of guards1.entries()) {
    if (!Object.is(guard, guards2[idx])) {

      return true;
    }
  }

  return false;
}

function effect(fn, ...guards) {
  if (guards.length > 0) {
    if (guards.length == 1 && Array.isArray(guards[0])) {
      guards = guards[0];
    }
  }

  else {
    guards = undefined;
  }

  var bucket = getCurrentBucket();
  if (bucket) {
    if (!(bucket.nextEffectIdx in bucket.effects)) {
      bucket.effects[bucket.nextEffectIdx] = [];
    }

    let effectIdx = bucket.nextEffectIdx;
    let effect = bucket.effects[effectIdx];

    if (guardsChanged(effect[1], guards)) {
      effect[0] = function effect() {
        if (typeof bucket.cleanups[effectIdx] == "function") {
          try {
            bucket.cleanups[effectIdx]();
          } finally {
            bucket.cleanups[effectIdx] = undefined;
          }
        }

        var ret = fn();

        if (typeof ret == "function") {
          bucket.cleanups[effectIdx] = ret;
        }
      };
      effect[1] = guards;
    }

    bucket.nextEffectIdx++;
  } else {
    throw new Error(
      "effect() only valid inside a contexified function."
    );
  }
}

function memo(fn, ...inputGuards) {
  if (inputGuards.length > 0) {
    if (inputGuards.length == 1 && Array.isArray(inputGuards[0])) {
      inputGuards = inputGuards[0];
    }
  }
  else {
    inputGuards = [fn];
  }

  var bucket = getCurrentBucket();
  if (bucket) {
    if (!(bucket.nextMemoizationIdx in bucket.memoizations)) {
      bucket.memoizations[bucket.nextMemoizationIdx] = [];
    }

    let memoization = bucket.memoizations[bucket.nextMemoizationIdx];

    if (guardsChanged(memoization[1], inputGuards)) {
      try {
        memoization[0] = fn();
      } finally {
        memoization[1] = inputGuards;
      }
    }

    bucket.nextMemoizationIdx++;

    return memoization[0];
  } else {
    throw new Error(
      "memo() only valid inside a contexified function."
    );
  }
}

function callback(fn, ...inputGuards) {
  if (getCurrentBucket()) {
    return memo(function callback() {
      return fn;
    }, ...inputGuards);
  } else {
    throw new Error(
      "callback() only valid inside a contexified function."
    );
  }
}

function ref(initialValue) {
  if (getCurrentBucket()) {
    var [ref] = state({ current: initialValue });
    return ref;
  } else {
    throw new Error(
      "ref() only valid inside a contexified function."
    );
  }
}


const functionContext = {
  createFunctionContext,
  state,
  reducer,
  effect,
  memo,
  callback,
  ref
};
export default functionContext;
