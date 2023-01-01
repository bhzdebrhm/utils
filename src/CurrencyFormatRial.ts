export const currency = (x?: string | number | null) => {
    if (typeof x == 'string' || typeof x == 'number')
        return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return ''
}