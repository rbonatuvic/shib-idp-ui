import { isValidRegex } from './is_valid_regex';

it('should return false for a malformed regular expression', () => {
    expect(isValidRegex(`\\f;klsdflk;sdf()**(&*&^^()`)).toBe(false)
});

it('should return true for a well-formed regular expression', () => {
    expect(isValidRegex(`[a-z0-9][a-z0-9-]{0,31}:`)).toBe(true)
});