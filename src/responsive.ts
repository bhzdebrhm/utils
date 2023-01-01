import { isArray } from 'lodash';
import { isObject } from './assertion';
import {  objectKeys } from './object';

export function mapResponsive(prop: any, mapper: (val: any) => any) {
    if (isArray(prop)) {
        return prop.map((item) => {
            if (item === null) {
                return null
            }
            return mapper(item)
        })
    }

    if (isObject(prop)) {
        return objectKeys(prop).reduce((result: Record<string, unknown>, key) => {
            result[key] = mapper(prop[key])
            return result
        }, {})
    }

    if (prop != null) {
        return mapper(prop)
    }

    return null
}