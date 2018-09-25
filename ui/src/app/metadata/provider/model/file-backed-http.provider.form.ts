import { Wizard } from '../../../wizard/model';
import { FileBackedHttpMetadataProvider } from '../../domain/model/providers/file-backed-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const FileBackedHttpMetadataProviderWizard: Wizard<FileBackedHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'FileBackedHttpMetadataProvider',
    type: 'FileBackedHttpMetadataResolver',
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
            schema: 'assets/schema/provider/filebacked-http-common.schema.json'
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 3,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json'
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 5,
            initialValues: [],
            schema: 'assets/schema/provider/metadata-provider-summary.schema.json'
        }
    ]
};


export const FileBackedHttpMetadataProviderEditor: Wizard<FileBackedHttpMetadataProvider> = {
    ...FileBackedHttpMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.editor.schema.json'
        },
        {
            id: 'reloading',
            label: 'label.reloading-attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json'
        },
        {
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 3,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        },
        {
            id: 'advanced',
            label: 'label.advanced-settings',
            index: 4,
            initialValues: [],
            locked: true,
            schema: 'assets/schema/provider/filebacked-http-advanced.schema.json'
        }
    ]
};
