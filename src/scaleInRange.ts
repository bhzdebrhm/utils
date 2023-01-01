/* eslint-disable eqeqeq */
export const scaleInRange = (value: number | null | undefined, sourceRangeMin: number, sourceRangeMax: number, targetRangeMin: number, targetRangeMax: number) => {
    if (!value) return value
    const substractedSource = sourceRangeMax - sourceRangeMin;
    const isNullableTargetRange = substractedSource == 0;
    const safeSource = isNullableTargetRange ? 1 : substractedSource
    return (targetRangeMax - targetRangeMin) * ((value - sourceRangeMin) / (safeSource)) + targetRangeMin
};

export const unScaleFromRange = (source: number, sourceRangeMin: number, sourceRangeMax: number, targetRangeMin: number, targetRangeMax: number) => {
    const substractedSource = sourceRangeMax - sourceRangeMin;
    const isNullableTargetRange = substractedSource == 0;
    const safeSource = isNullableTargetRange ? 1 : substractedSource;
    return ((source - targetRangeMin) / (targetRangeMax - targetRangeMin)) * (safeSource) + sourceRangeMin;
}