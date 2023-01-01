export const humanFriendly = (x: number) => {
    return Math.abs(x) < 1000000 && Math.abs(x) > 1000 ? Math.sign(x) * Number((Math.abs(x) / 1000).toFixed(1)) + 'K ' :
        Math.abs(x) < 1000000000 && Math.abs(x) >= 1000000 ? Math.sign(x) * Number((Math.abs(x) / 1000000).toFixed(1)) + 'M ' :
            Math.abs(x) > 1000000000 ? Math.sign(x) * Number((Math.abs(x) / 1000000000).toFixed(1)) + 'B ' : Math.sign(x) * Math.abs(x)
}