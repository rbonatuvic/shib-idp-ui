import * as selectors from './index';

describe('filter selectors', () => {
    describe('mergeFn', () => {
        it('should return merged objects', () => {
            expect(selectors.mergeFn({foo: 'bar' }, { resourceId: 'baz' })).toEqual({foo: 'bar', resourceId: 'baz'});
        });
    });

    describe('isAdditionalFilter', () => {
        it('should return filtered objects', () => {
            const filters = [{ '@type': 'EntityAttributes' }];
            expect(selectors.filterTypeFn(filters)).toEqual(filters);
        });

        it('should return filtered objects', () => {
            const filters = [{ '@type': 'EntityAttributes' }, { '@type': 'EntityRoleWhiteList' }];
            expect(selectors.filterTypeFn(filters).length).toBe(1);
        });
    });

    describe('isFilterPlugin', () => {
        it('should return false for entity attributes type', () => {
            expect(selectors.isFilterPlugin('EntityAttributes')).toBe(false);
        });
        selectors.filterPluginTypes.forEach(type => {
            it(`should return false for ${ type } type`, () => {
                expect(selectors.isFilterPlugin(type)).toBe(true);
            });
        });
    });

    describe('isAdditionalFilter', () => {
        it('should return false for entity attributes type', () => {
            expect(selectors.isAdditionalFilter('EntityAttributes')).toBe(true);
        });
        selectors.filterPluginTypes.forEach(type => {
            it(`should return false for ${ type } type`, () => {
                expect(selectors.isAdditionalFilter(type)).toBe(false);
            });
        });
    });

    describe('filterTypeFn', () => {
        it('should return filtered objects', () => {
            const filters = [{ '@type': 'EntityAttributes' }];
            expect(selectors.filterTypeFn(filters)).toEqual(filters);
        });

        it('should return filtered objects', () => {
            const filters = [{ '@type': 'EntityAttributes' }, { '@type': 'EntityRoleWhiteList' }];
            expect(selectors.filterTypeFn(filters).length).toBe(1);
        });
    });

    describe('filterOrderFn', () => {
        it('should return the ordered & filtered entities when they are not filter plugins', () => {
            const filters = {'foo': { '@type': 'EntityAttributes' }};
            const order = ['foo'];
            expect(selectors.filterOrderFn(filters, order)).toEqual(order);
        });

        it('should return entities that exist in the collection of additional filters', () => {
            const filters = { 'foo': { '@type': 'EntityAttributes' } };
            const order = ['bar'];
            expect(selectors.filterOrderFn(filters, order)).toEqual([]);
        });

        it('should return only additional filters', () => {
            const filters = { 'foo': { '@type': 'EntityRoleWhiteList' } };
            const order = ['foo'];
            expect(selectors.filterOrderFn(filters, order)).toEqual([]);
        });

        it('should return filtered objects', () => {
            const filters = { 'foo': { '@type': 'EntityAttributes' }, 'bar': { '@type': 'EntityRoleWhiteList' }};
            const order = ['foo', 'bar'];
            expect(selectors.filterOrderFn(filters, order).length).toBe(1);
        });
    });

    describe('pluginOrderFn', () => {
        it('should return the ordered & filtered entities when they are filter plugins', () => {
            const filters = { 'foo': { '@type': 'EntityRoleWhiteList' } };
            const order = ['foo'];
            expect(selectors.pluginOrderFn(filters, order)).toEqual(order);
        });

        it('should return entities that exist in the collection of filter plugins', () => {
            const filters = { 'foo': { '@type': 'EntityAttributes' } };
            const order = ['bar'];
            expect(selectors.pluginOrderFn(filters, order)).toEqual([]);
        });

        it('should return only filter plugins', () => {
            const filters = { 'foo': { '@type': 'EntityAttributes' } };
            const order = ['foo'];
            expect(selectors.pluginOrderFn(filters, order)).toEqual([]);
        });

        it('should return filtered objects', () => {
            const filters = { 'foo': { '@type': 'EntityAttributes' }, 'bar': { '@type': 'EntityRoleWhiteList' } };
            const order = ['foo', 'bar'];
            expect(selectors.pluginOrderFn(filters, order).length).toBe(1);
        });
    });
});
