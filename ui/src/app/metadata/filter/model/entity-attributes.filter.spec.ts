import { EntityAttributesFilter } from './entity-attributes.filter';

describe('Entity Attributes filter form', () => {
    it('should return an empty object for validators', () => {
        expect(EntityAttributesFilter.getValidators()).toEqual({});
    });

    describe('transformer', () => {
        it('should not modify the object', () => {
            expect(EntityAttributesFilter.formatter({})).toEqual({});
            expect(EntityAttributesFilter.parser({})).toEqual({});
        });
    });
});
