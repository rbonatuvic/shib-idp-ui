import { getFilteredListFn } from './';

describe('Provider Reducer selectors', () => {
    describe(`getFilteredListFn method`, () => {
        it('should return a list without the provider`s property', () => {

            const fn = getFilteredListFn('name');
            const name = 'foo';
            const collection = ['foo', 'bar', 'baz'];
            const provider = { name };

            expect(fn(collection, provider)).toEqual(['bar', 'baz']);
        });

        it('should return the list if the provider passed is null', () => {

            const fn = getFilteredListFn('name');
            const name = 'foo';
            const collection = ['foo', 'bar', 'baz'];

            expect(fn(collection, null)).toEqual(['foo', 'bar', 'baz']);
        });
    });
});
