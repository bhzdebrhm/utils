export function parseValue(value: number): number | undefined {
  const val: number = parseFloat(value.toString());

  if (isNaN(val)) {
    return;
  }
  if (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER) {
    return;
  }
  return val;
}

export function roundTo(value: number, precision: number): number {
  if (!Number.isFinite(value)) {
    throw new Error("Input value is not a finite number");
  }
  if (!Number.isInteger(precision) || precision < 0) {
    throw new Error("Precision is not a positive integer");
  }
  if (Number.isInteger(value)) {
    return value;
  }
  return parseFloat(value.toFixed(precision));
}
