export function stringAbbreviator(text: string, thresholdWords: number = 3) {
    if (text?.split(" ").length < thresholdWords) {
        return text;
    }
    if (typeof text != 'string' || !text) {
        return text;
    };
    // @ts-ignore
    const acronym = text
        .match(/[\p{Alpha}\p{Nd}]+/gu)
        .reduce((previous, next) => previous + ((+next === 0 || parseInt(next)) ? parseInt(next) : next[0] || ''), '')
        .toUpperCase()
    return acronym;
};