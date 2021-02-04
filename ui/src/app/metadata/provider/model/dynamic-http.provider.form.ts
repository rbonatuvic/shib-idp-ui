import { Wizard } from '../../../wizard/model';
import { DynamicHttpMetadataProvider } from '../../domain/model/providers/dynamic-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';
import { metadataFilterProcessor } from './utilities';
import RegexValidator from '../../../shared/validation/regex.validator';
import { memoize } from '../../../shared/memo';
import API_BASE_PATH from '../../../app.constant';

const checkRegex = memoize(RegexValidator.isValidRegex);

export const DynamicHttpMetadataProviderWizard: Wizard<DynamicHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'DynamicHttpMetadataProvider',
    type: 'DynamicHttpMetadataResolver',
    schemaPreprocessor: metadataFilterProcessor,
    getValidators(namesList: string[] = [], xmlIdList: string[] = []): any {
        const validators = BaseMetadataProviderEditor.getValidators(namesList, xmlIdList);

        validators['/metadataRequestURLConstructionScheme'] = (value, property, form) => {
            let errors;
            let keys = Object.keys(property.schema.properties);

            keys.forEach((item) => {
                const path = `/metadataRequestURLConstructionScheme/${item}`;
                const error = validators[path](value[item], property.properties[item], form);
                if (error) {
                    errors = errors || [];
                    errors.push(error);
                }
            });
            return errors;
        };

        validators['/metadataRequestURLConstructionScheme/content'] = (value, property, form) => {
            const err = !value ? {
                code: 'REQUIRED',
                path: `#${property.path}`,
                message: 'message.value-required',
                params: [value]
            } : null;
            return err;
        };

        validators['/metadataRequestURLConstructionScheme/@type'] = (value, property, form) => {
            const err = !value ? {
                code: 'REQUIRED',
                path: `#${property.path}`,
                message: 'message.type-required',
                params: [value]
            } : null;
            return err;
        };

        validators['/metadataRequestURLConstructionScheme/match'] = (value, property, form) => {
            if (!property.parent || !property.parent.value) {
                return null;
            }

            const error = {
                path: `#${property.path}`,
                params: [value]
            };

            const isRegex = property.parent.value['@type'] === 'Regex';
            let err = null;
            if (isRegex) {
                if (!value) {
                    err = {
                        ...error,
                        code: 'REQUIRED',
                        message: 'message.match-required'
                    };
                }
                if (!checkRegex(value)) {
                    err = {
                        ...error,
                        code: 'INVALID_REGEX',
                        message: 'message.invalid-regex-pattern'
                    };
                }
            }
            return err;
        };

        return validators;
    },
    schema: `${API_BASE_PATH}/ui/MetadataResolver/DynamicHttpMetadataResolver`,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'requireValidMetadata',
                'failFastInitialization',
                'metadataRequestURLConstructionScheme'
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'dynamicMetadataResolverAttributes'
            ]
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 5,
            initialValues: [],
            fields: [
                'enabled'
            ]
        }
    ]
};


export const DynamicHttpMetadataProviderEditor: Wizard<DynamicHttpMetadataProvider> = {
    ...DynamicHttpMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                '@type',
                'xmlId',
                'metadataRequestURLConstructionScheme',
                'enabled',
                'requireValidMetadata',
                'failFastInitialization'
            ],
            fieldsets: [
                {
                    type: 'section',
                    class: ['mb-3'],
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'metadataRequestURLConstructionScheme',
                        'enabled',
                        'requireValidMetadata',
                        'failFastInitialization'
                    ]
                }
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['DynamicHttpMetadataResolver'], description: 'value.dynamic-http-metadata-provider' }]
                }
            }
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'dynamicMetadataResolverAttributes'
            ]
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'advanced',
            label: 'label.http-settings-advanced',
            index: 4,
            initialValues: [],
            locked: true,
            fields: [
                'httpMetadataResolverAttributes'
            ]
        }
    ]
};
