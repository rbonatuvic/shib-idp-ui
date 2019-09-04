import { RegexValidator } from './regex.validator';

describe('RegexValidator', () => {
    describe('isValidRegex method', () => {
        it('should return true if no error is thrown', () => {
            expect(RegexValidator.isValidRegex('/abc/')).toBe(true);
            expect(RegexValidator.isValidRegex('/*123/')).toBe(true);
        });

        it('should return false if an error is thrown trying to construct a regex', () => {
            expect(RegexValidator.isValidRegex(')')).toBe(false);
        });

        it('should return false if the regex doesnt begin and end with slashes', () => {
            expect(RegexValidator.isValidRegex('abc')).toBe(false);
        });
    });
});
