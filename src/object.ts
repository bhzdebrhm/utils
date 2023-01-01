import { isArray,isObject, merge } from 'lodash';

export function traverse<T>(data_: T, callback: (key: string, value: any) => void) {
  const isArrayOrObject = (data: any) => {
    if (Array.isArray(data)) {
      return 1;
    } else if (typeof data == 'object') {
      return 2;
    } else {
      return 3;
    }
  };
  const isArrayOrObjecTraverse = (key: string, data: any) => {
    callback(key, data);
    if (isArrayOrObject(data) !== 3) {
      innerTraverse(data);
    }
  };
  const innerTraverse = (datas: any) => {
    if (isArrayOrObject(datas) !== 3) {
      for (let key in datas) {
        let data = datas?.[key];
        isArrayOrObjecTraverse(key, data);
      }
    }
  };

  innerTraverse(data_);
};


export const objectKeys = <T extends any>(obj: any) =>
  Object.keys(obj) as unknown as (keyof T)[]

type FilterFn<T> = (value: any, key: string, object: T) => boolean

/**
 * Returns the items of an object that meet the condition specified in a callback function.
 *
 * @param object the object to loop through
 * @param fn The filter function
 */
export function objectFilter<T extends Record<string, unknown>>(object: T, fn: FilterFn<T>) {
  const result: Record<string, unknown> = {}

  Object.keys(object).forEach((key) => {
    const value = object[key]
    const shouldPass = fn(value, key, object)
    if (shouldPass) {
      result[key] = value
    }
  })

  return result
}

export const filterUndefined = (object: Record<string, unknown>) =>
  objectFilter(object, (val) => val !== null && val !== undefined)


/**
 * Object.entries polyfill for Node v10 compatibility
 */
export const fromEntries = (entries: any) =>
  entries.reduce((carry: any, [key, value]: any) => {
    carry[key] = value
    return carry
  }, {}) as any



/**
 * Get value from a deeply nested object using a string path.
 * Memorizes the value.
 * @param obj - the object
 * @param path - the string path
 * @param fallback  - the fallback value
 */
export function get(
  obj: any,
  path: string | number,
  fallback?: any,
  index?: number,
) {
  const key = typeof path === "string" ? path.split(".") : [path]

  for (index = 0; index < key.length; index += 1) {
    if (!obj) break
    obj = obj[key[index]]
  }

  return obj === undefined ? fallback : obj
}



type Get = (
  obj: Readonly<object>,
  path: string | number,
  fallback?: any,
  index?: number,
) => any


export const memoize = (fn: Get) => {
  const cache = new WeakMap();

  const memoizedFn: Get = (obj, path, fallback, index) => {
    if (typeof obj === 'undefined') {
      return fn(obj, path, fallback, index);
    };

    if (!cache.has(obj)) {
      cache.set(obj, new Map());
    };

    const map = cache.get(obj);

    if (map.has(path)) {
      return map.get(path)
    };

    const value = fn(obj, path, fallback, index);

    map.set(path, value);

    return value;
  };


  return memoizedFn;
}


export const isCompound = (value: any) => isObject(value) || isArray(value);

//@ts-ignore
export function mergeCompound<TObject, TSource>(target: any, source: any) {
  const canMergeValues = isCompound(target) || isCompound(source);
  const safeMergePrimitive = source ? source : target ? target : typeof source === undefined ? target : source
  return canMergeValues ? merge(target, source) : safeMergePrimitive;
}


export const memoizedGet = memoize(get);