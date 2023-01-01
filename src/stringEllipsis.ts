export const stringEllipsis = (string: string, maxLength: number, { side = "end", ellipsis = "...", defaultString = "", } = {}) => {
    if (string && string.length > maxLength) {
        switch (side) {
            case "start":
                return ellipsis + string.slice(-(maxLength - ellipsis.length));
            case "end":
            default:
                return string.slice(0, maxLength - ellipsis.length) + ellipsis;
        }
    }
    return defaultString;
}