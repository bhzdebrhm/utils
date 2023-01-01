/* eslint-disable eqeqeq */

export const isUpperCase = (str: string) => {
    return /[A-Z]/.test(str);
}

export const isLowerCase = (str: string) => {
    return /[a-z]/.test(str);
}

export const checkLengthString = (count: number, str: string) => {
    return str.length >= count;
}

export const isDigits = (str: string) => {
    return /\d/.test(str)
}

export const isNonWords = (str: string) => {
    return /\W/.test(str)
}

export const passwordStrengthMeter = (value: string, cb: any,) => {
    let strengthMeter = [];

    if (value.length == 0) {
        cb({})
    }

    if (checkLengthString(8, value)) {
        strengthMeter.push('successLengthString');
    }

    if (isDigits(value)) {
        strengthMeter.push('isDigits');
    }

    if (isNonWords(value)) {
        strengthMeter.push('isNonWords');
    }

    if (isLowerCase(value)) {
        strengthMeter.push('isLowerCase');
    }

    if (isUpperCase(value)) {
        strengthMeter.push('isUpperCase');
    }

    if (strengthMeter.length <= 2) {
        cb({ message: 'ضعیف', type: 'week', strengthMeter })
    } else if (strengthMeter.length == 3 && strengthMeter.includes('successLengthString')) {
        cb({ message: 'متوسط', type: 'good', strengthMeter })
    } else if (strengthMeter.length >= 4 && strengthMeter.includes('successLengthString')) {
        cb({ message: 'قوی', type: 'strong', strengthMeter })
    }

}
