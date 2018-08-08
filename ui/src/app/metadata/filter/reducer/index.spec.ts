import * as selectors from './index';

describe('filter selectors', () => {
    describe('mergeFn', () => {
        it('should return merged objects', () => {
            expect(selectors.mergeFn({foo: 'bar' }, { resourceId: 'baz' })).toEqual({foo: 'bar', resourceId: 'baz'});
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
});
