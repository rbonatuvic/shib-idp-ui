import { UriValidator } from './uri.validator';
import { FormControl } from '@angular/forms';

describe('UriValidator class', () => {
    describe('isUri method', () => {
        it('should return false if invalid', () => {
            expect(UriValidator.isUri('foo')).toBe(false);
        });

        it('should return true if valid', () => {
            expect(UriValidator.isUri('http://foo.bar')).toBe(true);
        });
    });

    describe('uri method', () => {
        it('should return a validation object if invalid', () => {
            let form: FormControl = new FormControl('foo');
            expect(UriValidator.uri(form)).toEqual({uri: true});
        });

        it('should return null if valid', () => {
            let form: FormControl = new FormControl('http://goo.gle');
            expect(UriValidator.uri(form)).toBeNull();
        });
    });
});
