export const sortBySortingArr = (sortingArr: Array<any>, base: Array<any>) => {
    const results = sortingArr.map((k) => {
        const toRet = base?.find((item: any) => item === k);
        if (toRet) return toRet;
        else return null
    }).filter((item: any) => item);
    const unsortedItems = base.filter((item: any) => {
        return !results.includes(item)
    })
    return [...results, ...unsortedItems];
}
