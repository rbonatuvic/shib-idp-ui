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
                message: 'ID must be unique.',
                params: [value]
            } : null;
            return err;
        };
        return validators;
    },
    steps: [
        {
            id: 'common',
            label: 'Common Attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.schema.json'
        },
        {
            id: 'reloading',
            label: 'Reloading Attributes',
            index: 3,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json'
        },
        {
            id: 'plugins',
            label: 'Metadata Filter Plugins',
            index: 4,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        },
        {
            id: 'summary',
            label: 'FINISH SUMMARY AND VALIDATION',
            index: null,
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
            label: 'Common Attributes',
            index: 1,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.editor.schema.json'
        },
        {
            id: 'reloading',
            label: 'Reloading Attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-reloading.schema.json'
        },
        {
            id: 'plugins',
            label: 'Metadata Filter Plugins',
            index: 3,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        },
        {
            id: 'advanced',
            label: 'Advanced Settings',
            index: 4,
            initialValues: [],
            locked: true,
            schema: 'assets/schema/provider/filebacked-http-advanced.schema.json'
        }
    ]
};
