import { removeNulls } from './util';

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
