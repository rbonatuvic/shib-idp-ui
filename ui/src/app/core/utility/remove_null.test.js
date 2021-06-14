import { removeNull } from './remove_null';

it('should remove null values from an object', () => {

    const obj = {
        foo: null,
        bar: {
            baz: null
        }
    };

    expect(removeNull(obj, true)).toEqual({});
    expect(removeNull(obj, false)).toEqual({bar: { baz: null }});
});