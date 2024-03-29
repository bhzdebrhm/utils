export type Dict<T = any> = Record<string, T>


export type AnyFunction<T = any> = (...args: T[]) => any;

export type FunctionArguments<T extends Function> = T extends (
    ...args: infer R
) => any
    ? R
    : never