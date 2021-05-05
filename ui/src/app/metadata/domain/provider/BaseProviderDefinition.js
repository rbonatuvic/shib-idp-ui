import { metadataFilterProcessor } from './utility/providerFilterProcessor';

export const BaseProviderDefinition = {
    schemaPreprocessor: metadataFilterProcessor,
    parser: (changes) => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: [
            ...Object.keys(changes.metadataFilters).reduce((collection, filterName) => ([
                ...collection,
                {
                    ...changes.metadataFilters[filterName],
                    '@type': filterName
                }
            ]), [])
        ]
    }) : changes),
    formatter: (changes) => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: {
            ...(changes.metadataFilters || []).reduce((collection, filter) => ({
                ...collection,
                [filter['@type']]: filter
            }), {})
        }
    }) : changes),
    uiSchema: {
        
    }
}