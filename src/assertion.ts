import { Dict } from './types';

export const __DEV__ = process.env.REACT_APP_MODE !== "production";



// Array assertions
export function isArray<T>(value: any): value is Array<T> {
  return Array.isArray(value)
}

// Object assertions
export function isObject(value: any): value is Dict {
  const type = typeof value
  return (
    value != null &&
    (type === "object" || type === "function") &&
    !isArray(value)
  )
}

// Function assertions
export function isFunction<T extends Function = Function>(
  value: any,
): value is T {
  return typeof value === "function"
}

// String assertions
export function isString(value: any): value is string {
  return Object.prototype.toString.call(value) === "[object String]"
}
// Number assertions
export function isNumber(value: any): value is number {
  return typeof value === "number"
}

export function isCssVar(value: string): boolean {
  return /^var\(--.+\)$/.test(value)
}
