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
            schema: 'assets/schema/provider/local-dynamic.schema.json',
            fields: [
                'xmlId',
                'sourceDirectory'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlid',
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
            schema: 'assets/schema/provider/local-dynamic.schema.json',
            fields: [
                'reloadableMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 4,
            initialValues: [],
            schema: 'assets/schema/provider/file-system.schema.json',
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
            schema: 'assets/schema/provider/local-dynamic.schema.json',
            fields: [
                'enabled',
                'xmlId',
                'sourceDirectory',
            ]
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/local-dynamic.schema.json',
            fields: [
                'reloadableMetadataResolverAttributes'
            ]
        }
    ]
};
