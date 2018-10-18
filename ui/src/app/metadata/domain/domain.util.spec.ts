import * as util from './domain.util';
import { MetadataProvider } from './model';

describe('Domain Utility methods', () => {

    describe('combineAllFn', () => {
        it('should return true when the selected id is found', () => {
            expect(util.combineAllFn(['foo'], ['bar'])).toEqual(['bar', 'foo']);
        });
    });

    describe('doesExistFn', () => {
        it('should return true when the selected id is found', () => {
            expect(util.doesExistFn(['foo', 'bar'], 'foo')).toBe(true);
        });
        it('should return false when the selected id is not found', () => {
            expect(util.doesExistFn(['foo'], 'bar')).toBe(false);
        });
    });

    describe('getInCollectionFn', () => {
        const entities = { foo: {}, bar: {} };
        it('should return the entity with the given id', () => {
            expect(util.getInCollectionFn(entities, 'foo')).toBe(entities.foo);
        });
        it('should return null when provided a null id', () => {
            expect(util.getInCollectionFn(entities, null)).toBeNull();
        });
    });

    describe('getEntityIdsFn', () => {
        const entities = [{ entityId: 'foo' }, { entityId: 'bar' }];
        it('should return a list of ids', () => {
            expect(util.getEntityIdsFn(entities)).toEqual(['foo', 'bar']);
        });
    });

    describe('mergeProviderOrderFn', () => {
        const providers = <MetadataProvider[]>[
            { id: 'foo', name: 'foo', '@type': 'foo', enabled: true, xmlId: 'id', sortKey: 1, metadataFilters: [] },
            { id: 'bar', name: 'bar', '@type': 'bar', enabled: false, xmlId: 'id2', sortKey: 2, metadataFilters: [] },
            { id: 'baz', name: 'baz', '@type': 'baz', enabled: false, xmlId: 'id3', sortKey: 3, metadataFilters: [] }
        ];
        it('1 should sort the list accordingly', () => {
            let order = ['bar', 'foo', 'baz'],
                ordered = util.mergeOrderFn([...providers], order);
            expect(ordered.indexOf(providers[0])).toBe(1);
        });

        it('2 should sort the list accordingly', () => {
            let order = ['foo', 'bar', 'baz'],
                ordered = util.mergeOrderFn(providers, order);
            expect(ordered.indexOf(providers[0])).toBe(0);
        });
    });
});
