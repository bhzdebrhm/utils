export const getItemJson = (list: any, item: string, value: string | number) => {
    return (list || []).filter((elm: any) => elm[item] == value)[0]
}