import {
    getResolverEntityIdCollectionFn,
    getAllOtherIdsFn,
    getResolverUniqueValidEntityIdsFn
} from './index';

describe('Resolver Reducer selectors', () => {
    describe(`getResolverEntityIdCollectionFn function`, () => {
        it('should return a list of entity ids', () => {

            const resolvers = [
                {
                    entityId: 'foo'
                },
                {
                    entityId: 'bar'
                },
                {
                    entityId: 'baz'
                }
            ];

            expect(getResolverEntityIdCollectionFn(resolvers)).toEqual(['foo', 'bar', 'baz']);
        });
    });

    describe('getResolverUniqueValidEntityIdsFn function', () => {
        it('should return a unique and valid list of ids from the provided list', () => {
            const ids = ['foo', undefined, undefined, 'foo', 'bar'];
            expect(getResolverUniqueValidEntityIdsFn(ids)).toEqual(['foo', 'bar']);
        });
    });

    describe('getAllOtherIdsFn function', () => {
        it('should return a list of ids without the selected', () => {
            const ids = ['foo', 'bar', 'baz'];
            expect(getAllOtherIdsFn(ids, 'foo')).toEqual(['bar', 'baz']);
        });
    });
});
