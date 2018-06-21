import * as util from './domain.util';

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
});
