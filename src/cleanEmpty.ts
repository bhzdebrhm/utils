export const cleanEmpty = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj
            .map(v => (v && typeof v === 'object') ? cleanEmpty(v) : v)
            .filter(v => !(v == null || v === 'none'));
    } else {
        return Object.entries(obj)
            .map(([k, v]) => [k, v && typeof v === 'object' ? cleanEmpty(v) : v])
            .reduce((a: any, [k, v]) => (v == null || v === 'none' ? a : (a[k] = v, a)), {});
    }
}