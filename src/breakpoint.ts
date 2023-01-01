
import {fromEntries} from './object';
import {isNumber, isObject} from 'lodash';
import {getLastItem} from './array';

const sortByBreakpointValue = (a: any[], b: any[]) =>
parseInt(a[1], 10) > parseInt(b[1], 10) ? 1 : -1

const sortBps = (breakpoints: any): any =>
fromEntries(Object.entries(breakpoints).sort(sortByBreakpointValue))



function analyzeCSSValue(value: number | string) {
    const num = parseFloat(value.toString())
    const unit = value.toString().replace(String(num), "")
    return { unitless: !unit, value: num, unit }
  }
  

export function px(value: number | string | null): string | null {
    if (value == null) return value as string | null
    const { unitless } = analyzeCSSValue(value)
    //@ts-ignore
    return unitless || isNumber(value) ? `${value}px` : value
  }

function normalize(breakpoints: any) {
    const sorted = sortBps(breakpoints)
    return Object.assign(Object.values(sorted), sorted) as string[]
  }

  function subtract(value: string) {
    if (!value) return value
    value = px(value) ?? value
    const factor = value.endsWith("px")
      ? -1
      : // the equivalent of 1px in em using a 16px base
        -0.0635
    return isNumber(value)
      ? `${value + factor}`
      : value.replace(/(\d+\.?\d*)/u, (m) => `${parseFloat(m) + factor}`)
  }



  function queryString(min: string | null, max?: string) {
    const query = ["@media screen"]
  
    if (min) query.push("and", `(min-width: ${px(min)})`)
    if (max) query.push("and", `(max-width: ${px(max)})`)
  
    return query.join(" ")
  }
  


  function keys(breakpoints: any) {
    const value = Object.keys(sortBps(breakpoints))
    return new Set(value)
  }
  

export function analyzeBreakpoints(breakpoints: any) {
    if (!breakpoints) return null
  
    breakpoints.base = breakpoints.base ?? "0px"
  
    const normalized = normalize(breakpoints)
  
    const queries = Object.entries(breakpoints)
      .sort(sortByBreakpointValue)
      .map(([breakpoint, minW]: any, index, entry) => {
        let [, maxW]: any = entry[index + 1] ?? []
        maxW = parseFloat(maxW) > 0 ? subtract(maxW) : undefined
        return {
          breakpoint,
          minW,
          maxW,
          maxWQuery: queryString(null, maxW),
          minWQuery: queryString(minW),
          minMaxQuery: queryString(minW, maxW),
        }
      })
  
    const _keys = keys(breakpoints)
    const _keysArr = Array.from(_keys.values())
  
    return {
      keys: _keys,
      normalized,
      isResponsive(test: any) {
        const keys = Object.keys(test)
        return keys.length > 0 && keys.every((key) => _keys.has(key))
      },
      asObject: sortBps(breakpoints),
      asArray: normalize(breakpoints),
      details: queries,
      media: [null, ...normalized.map((minW) => queryString(minW)).slice(1)],
      toArrayValue(test: any) {
        if (!isObject(test)) {
          throw new Error("toArrayValue: value must be an object")
        }
        const result = _keysArr.map((bp) => (test as any)[bp] ?? null)
        while (getLastItem(result) === null) {
          result.pop()
        }
        return result
      },
      toObjectValue(test: any[]) {
        if (!Array.isArray(test)) {
          throw new Error("toObjectValue: value must be an array")
        }
        return test.reduce((acc, value, index) => {
          const key = _keysArr[index]
          if (key != null && value != null) acc[key] = value
          return acc
        }, {} as any)
      },
    }
  }

  export type AnalyzeBreakpointsReturn = ReturnType<typeof analyzeBreakpoints>