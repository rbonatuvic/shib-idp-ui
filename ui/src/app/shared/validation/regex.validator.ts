export class RegexValidator {
    static isValidRegex(pattern: string): boolean {
        if (!pattern) {
            return false;
        }
        let regex;
        try {
            regex = new RegExp(pattern);
        } catch (err) {
            return false;
        }
        return true;
    }
}

export default RegexValidator;
