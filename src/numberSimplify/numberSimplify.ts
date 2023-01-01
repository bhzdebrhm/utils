import { NumberSimplifyOptions, defaultOptions } from "./options";
import { parseValue, roundTo } from "./utils";

const DIGIT_GROUPING_BASE = 1000;

function* divider(value: number): any {
  let denominator = DIGIT_GROUPING_BASE;

  while (true) {
    const result = value / denominator;
    if (result < 1) {
      return;
    }

    yield result;
    denominator *= DIGIT_GROUPING_BASE;
  }
}


function numberSimplify(value: number, options?: Partial<NumberSimplifyOptions>): string | undefined {

  const opts: NumberSimplifyOptions = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;

  if (!Array.isArray(opts.units) || !opts.units.length) {
    throw new Error("Option `units` must be a non-empty array");
  }


  let val = parseValue(value);


  if (val) {
    const prefix = val < 0 ? "-" : "";

    val = Math.abs(val);


    let unitIndex = 0;
    for (const result of divider(val)) {
      val = result;
      unitIndex += 1;
    }


    const unitIndexOutOfRange = unitIndex >= opts.units.length;
    if (unitIndexOutOfRange) {
      return value.toString();
    }


    let rounded = roundTo(val!, opts.precision);


    for (const result of divider(rounded)) {
      rounded = result;
      unitIndex += 1;
    }

    const unit = opts.units[unitIndex] ?? "";
    const suffix = opts.lowercase ? unit.toLowerCase() : unit;


    const space = opts.space ? " " : "";


    const formatted = rounded
      .toString()
      .replace(defaultOptions.decimalSeparator, opts.decimalSeparator);

    return `${prefix}${formatted}${space}${suffix}`;
  }
}

export { numberSimplify };

export default numberSimplify;
