export function charRemover(text: string, charsToRemvove: Array<string>) {
    let draftText = text;
    charsToRemvove.forEach((chr) => {
        draftText = draftText.replace(chr, "");
    });

    return draftText
}