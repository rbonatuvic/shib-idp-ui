import { Wizard } from '../../../wizard/model';
import { DynamicHttpMetadataProvider } from '../../domain/model/providers/dynamic-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const DynamicHttpMetadataProviderWizard: Wizard<DynamicHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'DynamicHttpMetadataProvider',
    type: 'DynamicHttpMetadataResolver',
    bindings: {},
    formatter: (changes: DynamicHttpMetadataProvider) => {
        let base = BaseMetadataProviderEditor.formatter(changes);
        if (base.dynamicMetadataResolverAttributes) {
            if (base.dynamicMetadataResolverAttributes.refreshDelayFactor) {
                base.dynamicMetadataResolverAttributes.refreshDelayFactor =
                    base.dynamicMetadataResolverAttributes.refreshDelayFactor.toString();
            }
        }
        return base;
    },
    getValidators(namesList: string[] = [], xmlIdList: string[] = []): any {
        const validators = BaseMetadataProviderEditor.getValidators(namesList);
        validators['/xmlId'] = (value, property, form) => {
            const err = xmlIdList.indexOf(value) > -1 ? {
                code: 'INVALID_ID',
                path: `#${property.path}`,
                message: 'message.id-unique',
                params: [value]
            } : null;
            return err;
        };

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
            const isRegex = property.parent.value['@type'] === 'Regex';
            const err = isRegex && !value ? {
                code: 'REQUIRED',
                path: `#${property.path}`,
                message: 'message.match-required',
                params: [value]
            } : null;
            return err;
        };

        return validators;
    },
    schema: '/api/ui/MetadataResolver/DynamicHttpMetadataResolver',
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
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
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
                'xmlId',
                'metadataRequestURLConstructionScheme',
                'enabled',
                'requireValidMetadata',
                'failFastInitialization'
            ],
            order: ['xmlId', 'metadataRequestURLConstructionScheme', 'enabled', 'requireValidMetadata', 'failFastInitialization']
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
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
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
