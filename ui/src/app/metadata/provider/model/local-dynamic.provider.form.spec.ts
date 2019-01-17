import { LocalDynamicMetadataProviderWizard } from './local-dynamic.provider.form';

describe('LocalDynamicMetadataProviderWizard', () => {

    const parser = LocalDynamicMetadataProviderWizard.parser;
    const formatter = LocalDynamicMetadataProviderWizard.formatter;
    const getValidators = LocalDynamicMetadataProviderWizard.getValidators;

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
                '@type': 'LocalDynamicMetadataResolver',
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
                '@type': 'LocalDynamicMetadataResolver',
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
                '@type': 'LocalDynamicMetadataResolver',
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
                '@type': 'LocalDynamicMetadataResolver',
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

    describe('getValidators method', () => {
        it('should return a list of validators for the ngx-schema-form', () => {
            expect(Object.keys(getValidators([]))).toEqual([
                '/',
                '/name',
                '/xmlId'
            ]);
        });
    });
});
