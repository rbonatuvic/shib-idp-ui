import { removeNulls, checkByType } from './util';

describe('removeNulls', () => {
    let obj = {
        foo: null,
        bar: 'baz'
    },
        expected = {
            bar: 'baz'
        };
    it(`should remove null values from the object provided`, () => {
        expect(removeNulls(obj)).toEqual(expected);
    });

    it(`should return an empty object if passed a falsy value`, () => {
        expect(removeNulls(undefined)).toEqual({});
    });
});

describe('checkByType', () => {
    it('should return false for an empty object', () => {
        expect(checkByType({})).toBe(false);
    });
    it('should return for a populated object', () => {
        expect(checkByType({foo: 'bar'})).toBe(true);
    });
    it('should return true for non-object types', () => {
        expect(checkByType('foo')).toBe(true);
    });
});
