import { Wizard } from '../../../wizard/model';
import { FileBackedHttpMetadataProvider } from '../../domain/model/providers/file-backed-http-metadata-provider';

export const FileBackedHttpMetadataProviderWizard: Wizard<FileBackedHttpMetadataProvider> = {
    label: 'FileBackedHttpMetadataProvider',
    type: '@FileBackedHttpMetadataProvider',
    translate: {
        parser: (changes) => ({
            ...changes,
            metadataFilters: [
                ...Object.keys(changes.metadataFilters || {}).reduce((collection, filterName) => ([
                    ...collection,
                    {
                        ...changes.metadataFilters[filterName],
                        '@type': filterName
                    }
                ]), [])
            ]
        }),
        formatter: (changes) => ({
            ...changes,
            metadataFilters: {
                ...(changes.metadataFilters || []).reduce((collection, filter) => ({
                    ...collection,
                    [filter['@type']]: filter
                }), {})
            }
        })
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
            id: 'filters',
            label: 'Metadata Filter Plugins',
            index: 4,
            initialValues: [
                { key: 'metadataFilters', value: [] }
            ],
            schema: 'assets/schema/provider/filebacked-http-filters.schema.json'
        }
    ]
};
