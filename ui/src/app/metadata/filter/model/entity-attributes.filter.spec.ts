import { EntityAttributesFilter } from './entity-attributes.filter';

describe('Entity Attributes filter form', () => {
    it('should return an empty object for validators', () => {
        expect(EntityAttributesFilter.getValidators()).toEqual({});
    });

    describe('transformer', () => {
        it('should not modify the object', () => {
            expect(EntityAttributesFilter.translate.formatter({})).toEqual({});
            expect(EntityAttributesFilter.translate.parser({})).toEqual({});
        });
    });
});
