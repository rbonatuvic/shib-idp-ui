const regexChecker = new RegExp('^\/|\/$', 'g');

export class RegexValidator {
    static isValidRegex(pattern: string): boolean {
        if (!pattern) {
            return true;
        }
        let regex;
        try {
            regex = new RegExp(pattern);
        } catch (err) {
            return false;
        }
        return regexChecker.test(pattern);
    }
}

export default RegexValidator;
