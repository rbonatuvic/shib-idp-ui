import { Wizard } from '../../../wizard/model';
import { LocalDynamicMetadataProvider } from '../../domain/model/providers/local-dynamic-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';
import { MetadataProvider } from '../../domain/model';

export const LocalDynamicMetadataProviderWizard: Wizard<LocalDynamicMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'LocalDynamicMetadataProvider',
    type: 'LocalDynamicMetadataResolver',
    formatter: (changes: LocalDynamicMetadataProvider) => {
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
        return validators;
    },
    schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'sourceDirectory'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'sourceDirectory'
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'dynamicMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'dynamicMetadataResolverAttributes'
                    ]
                }
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 4,
            initialValues: [],
            fields: [
                'enabled'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'enabled'
                    ]
                }
            ]
        }
    ]
};


export const LocalDynamicMetadataProviderEditor: Wizard<LocalDynamicMetadataProvider> = {
    ...LocalDynamicMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                '@type',
                'enabled',
                'xmlId',
                'sourceDirectory',
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['LocalDynamicMetadataResolver'], description: 'value.local-dynamic-metadata-provider' }]
                }
            },
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
                        'enabled',
                        'xmlId',
                        'sourceDirectory',
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'dynamicMetadataResolverAttributes'
            ]
        }
    ]
};
