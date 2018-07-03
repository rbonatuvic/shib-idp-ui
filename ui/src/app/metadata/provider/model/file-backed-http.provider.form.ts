import { Wizard } from '../../../wizard/model';
import { MetadataProvider } from '../../domain/model';

export const FileBackedHttpMetadataProviderWizard: Wizard<MetadataProvider> = {
    label: 'FileBackedHttpMetadataProvider',
    type: '@FileBackedHttpMetadataProvider',
    steps: [
        {
            id: 'common',
            label: 'Common Attributes',
            index: 2,
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-common.schema.json',
            parser: (changes: Partial<MetadataProvider>, schema: any) => (<MetadataProvider>{ name: '', '@type': '' })
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
            initialValues: [],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        }
    ]
};
