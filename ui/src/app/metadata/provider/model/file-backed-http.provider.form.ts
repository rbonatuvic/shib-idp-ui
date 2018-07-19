import { Wizard } from '../../../wizard/model';
import { FileBackedHttpMetadataProvider } from '../../domain/model/providers/file-backed-http-metadata-provider';
import { BaseMetadataProviderEditor } from './base.provider.form';

export const FileBackedHttpMetadataProviderWizard: Wizard<FileBackedHttpMetadataProvider> = {
    ...BaseMetadataProviderEditor,
    label: 'FileBackedHttpMetadataProvider',
    type: 'FileBackedHttpMetadataResolver',
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
            id: 'filters',
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
            id: 'filter-list',
            label: 'Filter List',
            index: 0
        },
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
            id: 'filters',
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
            schema: 'assets/schema/provider/filebacked-http-advanced.schema.json'
        }
    ]
};
