import { DynamicHttpMetadataProviderWizard } from './dynamic-http.provider.form';

const schema = {
    'type': 'object',
    'required': [
        '@type',
        'content'
    ],
    'properties': {
        '@type': {
            'title': 'label.md-request-type',
            'description': 'tooltip.md-request-type',
            'type': 'string',
            'widget': {
                'id': 'select'
            },
            'oneOf': [
                {
                    'enum': [
                        'MetadataQueryProtocol'
                    ],
                    'description': 'value.md-query-protocol'
                },
                {
                    'enum': [
                        'Regex'
                    ],
                    'description': 'value.regex'
                }
            ]
        },
        'content': {
            'title': 'label.md-request-value',
            'description': 'tooltip.md-request-value',
            'type': 'string'
        },
        'match': {
            'title': 'label.match',
            'description': 'tooltip.match',
            'type': 'string',
            'visibleIf': {
                '@type': [
                    'Regex'
                ]
            }
        }
    }
};

describe('DynamicHttpMetadataProviderWizard', () => {

    const parser = DynamicHttpMetadataProviderWizard.parser;
    const formatter = DynamicHttpMetadataProviderWizard.formatter;
    const getValidators = DynamicHttpMetadataProviderWizard.getValidators;

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
                '@type': 'DynamicHttpMetadataResolver',
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
                '@type': 'DynamicHttpMetadataResolver',
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
                '@type': 'DynamicHttpMetadataResolver',
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
                '@type': 'DynamicHttpMetadataResolver',
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
                '/xmlId',
                '/metadataRequestURLConstructionScheme',
                '/metadataRequestURLConstructionScheme/content',
                '/metadataRequestURLConstructionScheme/@type',
                '/metadataRequestURLConstructionScheme/match'
            ]);
        });
    });

    describe('validators', () => {
        let validators,
            metadataRequestURLConstructionScheme,
            metadataRequestURLConstructionSchemeContent,
            metadataRequestURLConstructionSchemeType,
            metadataRequestURLConstructionSchemeMatch;

        beforeEach(() => {
            validators = getValidators([], []);
        });

        describe('metadataRequestURLConstructionScheme', () => {
            it('should check other validators and propagate those errors up', () => {
                const value = {
                    content: null,
                    '@type': null,
                    match: 'foo'
                };
                const property = { value, schema, properties: null };
                property.properties = {
                    content: {
                        path: 'content',
                        parent: property
                    },
                    '@type': {
                        path: '@type',
                        parent: property
                    },
                    match: {
                        path: 'match',
                        parent: property
                    }
                };
                const validator = validators['/metadataRequestURLConstructionScheme'];
                expect(validator(value, property, null).length).toBe(2);
            });
        });
    });
});
