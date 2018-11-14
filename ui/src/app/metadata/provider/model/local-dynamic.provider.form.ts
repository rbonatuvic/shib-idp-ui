import { Wizard } from '../../../wizard/model';
import { LocalDynamicMetadataProvider } from '../../domain/model/providers/local-dynamic-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const LocalDynamicMetadataProviderWizard: Wizard<LocalDynamicMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'LocalDynamicMetadataProvider',
    type: 'LocalDynamicMetadataResolver',
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
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
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
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 3,
            initialValues: [],
            schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
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
            schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
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
            schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
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
                        '@type',
                        'enabled'
                    ]
                },
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'sourceDirectory',
                    ]
                }
            ]
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 2,
            initialValues: [],
            schema: '/api/ui/MetadataResolver/LocalDynamicMetadataResolver',
            fields: [
                'dynamicMetadataResolverAttributes'
            ]
        }
    ]
};
