import * as selectors from './index';

describe('Metadata Provider reducer functions', () => {
    describe(`combineAllFn`, () => {
        it('should combine arrays', () => {
            let a = ['foo', 'bar'],
                b = ['baz', 'hrm'];
            expect(selectors.combineAllFn(a, b)).toEqual([...b, ...a]);
        });
    });
    describe(`doesExistFn`, () => {
        it('should test whether the provided index is in the provided collection', () => {
            expect(selectors.doesExistFn(['foo', 'bar'], 'foo')).toBe(true);
            expect(selectors.doesExistFn(['bar', 'baz'], 'foo')).toBe(false);
        });
    });
    describe(`getInCollectionFn`, () => {
        it('should retrieve the item from the provided collection by index', () => {
            expect(selectors.getInCollectionFn({ foo: 'bar' }, 'foo')).toEqual('bar');
        });
    });
    describe(`getEntityIdsFn`, () => {
        it('should create a collection of entity ids from the provided entities', () => {
            expect(selectors.getEntityIdsFn([{entityId: 'foo'}])).toEqual(['foo']);
        });
    });
    describe(`getProvidersFromStateFn`, () => {
        it('should select the providers slice of state', () => {
            let providers = [];
            expect(selectors.getProvidersFromStateFn({ providers })).toBe(providers);
        });
    });
    describe(`getDraftsFromStateFn`, () => {
        it('should select the providers slice of state', () => {
            let drafts = [];
            expect(selectors.getDraftsFromStateFn({ drafts })).toBe(drafts);
        });
    });
});
