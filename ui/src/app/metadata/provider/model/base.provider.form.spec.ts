import { BaseMetadataProviderEditor } from './base.provider.form';

describe('BaseMetadataProviderForm', () => {

    const parser = BaseMetadataProviderEditor.parser;
    const formatter = BaseMetadataProviderEditor.formatter;

    const requiredValidUntilFilter = {
        maxValidityInterval: 1,
        '@type': 'RequiredValidUntil'
    };

    const signatureValidationFilter = {
        requireSignedRoot: true,
        certificateFile: 'foo',
        '@type': 'SignatureValidation'
    };

    const entityRoleWhiteListFilter = {
        retainedRoles: ['foo', 'bar'],
        removeRolelessEntityDescriptors: true,
        removeEmptyEntitiesDescriptors: true,
        '@type': 'EntityRoleWhiteList'
    };

    describe('parser', () => {
        it('should transform the filters object to an array', () => {
            let model = <any>{
                name: 'foo',
                '@type': 'FileBackedHttpMetadataProvider',
                enabled: true,
                resourceId: 'foo',
                metadataFilters: {
                    RequiredValidUntil: requiredValidUntilFilter,
                    SignatureValidation: signatureValidationFilter,
                    EntityRoleWhiteList: entityRoleWhiteListFilter
                }
            };
            expect(
                parser(model)
            ).toEqual(
                {
                    ...model,
                    metadataFilters: [
                        requiredValidUntilFilter,
                        signatureValidationFilter,
                        entityRoleWhiteListFilter
                    ]
                }
            );
        });

        it('should return the object if metadataFilters is not provided', () => {
            let model = <any>{
                name: 'foo',
                '@type': 'FileBackedHttpMetadataProvider',
                enabled: true,
                resourceId: 'foo'
            };
            expect(
                parser(model)
            ).toEqual(
                model
            );
        });
    });

    describe('formatter', () => {
        it('should transform the filters object to an array', () => {
            let model = <any>{
                name: 'foo',
                '@type': 'FileBackedHttpMetadataProvider',
                enabled: true,
                resourceId: 'foo',
                metadataFilters: [
                    requiredValidUntilFilter,
                    signatureValidationFilter,
                    entityRoleWhiteListFilter
                ]
            };
            expect(
                formatter(model)
            ).toEqual(
                {
                    ...model,
                    metadataFilters: {
                        RequiredValidUntil: requiredValidUntilFilter,
                        SignatureValidation: signatureValidationFilter,
                        EntityRoleWhiteList: entityRoleWhiteListFilter
                    }
                }
            );
        });

        it('should return the object if metadataFilters is not provided', () => {
            let model = <any>{
                name: 'foo',
                '@type': 'FileBackedHttpMetadataProvider',
                enabled: true,
                resourceId: 'foo'
            };
            expect(
                formatter(model)
            ).toEqual(
                model
            );
        });
    });

    describe('getValidators', () => {
        it('should return a set of validator functions for the provider type', () => {
            const validators = BaseMetadataProviderEditor.getValidators([]);
            expect(validators).toBeDefined();
            expect(validators['/']).toBeDefined();
            expect(validators['/name']).toBeDefined();
        });

        describe('name `/name` validator', () => {
            const validators = BaseMetadataProviderEditor.getValidators(['foo', 'bar']);

            it('should return an invalid object when provided values are invalid based on name', () => {
                expect(validators['/name']('foo', { path: '/name' })).toBeDefined();
            });

            it('should return null when provided values are valid based on name', () => {
                expect(validators['/name']('baz', { path: '/name' })).toBeNull();
            });
        });

        describe('parent `/` validator', () => {
            const validators = BaseMetadataProviderEditor.getValidators(['foo', 'bar']);

            it('should return a list of child errors', () => {
                expect(validators['/']({name: 'foo'}, { path: '/name' }, {}).length).toBe(1);
            });

            it('should ignore properties that don\'t exist a list of child errors', () => {
                expect(validators['/']({ foo: 'bar' }, { path: '/foo' }, {})).toBeUndefined();
            });
        });
    });
});
