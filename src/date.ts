import { ConfigType } from 'dayjs';
import { EventValue } from 'rc-picker/lib/interface';

import dayjs from '../components/lib/dayjs/dayjs';

export const convertTimeStampToUtc = (timeStamp: number) => {
    try {
        const milisecondTimestamp = timeStamp * 1000;
        return new Date(milisecondTimestamp).toUTCString();
    } catch (error) {
        //
    }
};

type calendarType = 'jalali' | 'gregory';
/**
 *
 * @param date ConfigType | ISO8601
 * @param calendar calendarType
 */
export const convertor = (date?: ConfigType | EventValue<ConfigType> | null, calendar: calendarType = 'jalali') => {
    let shortTime = undefined;
    let longTime = undefined;
    let dateWithDash = undefined;
    let unix = undefined;
    let dateWithSlash = undefined;
    let parsDate = (format?: string): string | undefined => undefined;
    let ISO = undefined;
    let ISOWITHOUTZ = undefined;
    if (date) {
        try {
            shortTime = dayjs(date).format('HH:mm');
            longTime = dayjs(date).format('HH:mm:ss');
            // @ts-ignore
            unix = dayjs(date).calendar(calendar).unix();
            // @ts-ignore
            dateWithDash = dayjs(date).calendar(calendar).format('YYYY-MM-DD');
            // @ts-ignore
            dateWithSlash = dayjs(date).calendar(calendar).format('YYYY/MM/DD');
            parsDate = (format = 'dddd D MMMM YYYY') =>
                // @ts-ignore
                dayjs(date).calendar(calendar).format(format);
            // @ts-ignore
            ISO = dayjs(date).calendar(calendar).toISOString();
            ISOWITHOUTZ = dayjs(date).calendar(calendar).toISOString().slice(0, -5);
        } catch (error) {
            //
        }
    }

    return {
        unix,
        /**
         * @returns HH:mm
         */
        shortTime,
        /**
         * @returns HH:mm:ss
         */
        longTime,
        /**
         * @returns YYYY-MM-DD
         */
        dateWithDash,
        /**
         * @returns YYYY/MM/DD
         */
        dateWithSlash,
        /**
         * @returns dddd D MMMM YYYY
         * @example `دوشنبه ۱۳ بهمن ۱۳۹۹`
         */
        parsDate,

        ISO,

        ISOWITHOUTZ,
    };
};
