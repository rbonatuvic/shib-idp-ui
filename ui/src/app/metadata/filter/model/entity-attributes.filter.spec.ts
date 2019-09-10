import { EntityAttributesFilter } from './entity-attributes.filter';

describe('Entity Attributes filter form', () => {
    describe('getValidators', () => {
        it('should return an empty object for validators', () => {
            expect(Object.keys(EntityAttributesFilter.getValidators())).toEqual([
                '/',
                '/name',
                '/entityAttributesFilterTarget'
            ]);
        });

        describe('name `/name` validator', () => {
            const validators = EntityAttributesFilter.getValidators(['foo', 'bar']);

            it('should return an invalid object when provided values are invalid based on name', () => {
                expect(validators['/name']('foo', { path: '/name' })).toBeDefined();
            });

            it('should return null when provided values are valid based on name', () => {
                expect(validators['/name']('baz', { path: '/name' })).toBeNull();
            });
        });

        describe('parent `/` validator', () => {
            const validators = EntityAttributesFilter.getValidators(['foo', 'bar']);

            it('should return a list of child errors', () => {
                expect(validators['/']({ name: 'foo' }, { path: '/name' }, {}).length).toBe(1);
            });

            it('should ignore properties that don\'t exist a list of child errors', () => {
                expect(validators['/']({ foo: 'bar' }, { path: '/foo' }, {})).toBeUndefined();
            });
        });
    });

    describe('transformer', () => {
        it('should add modify the object', () => {
            expect(EntityAttributesFilter.formatter({})).toEqual({});
            expect(EntityAttributesFilter.parser({}).relyingPartyOverrides).toBeDefined();
        });
    });
});
