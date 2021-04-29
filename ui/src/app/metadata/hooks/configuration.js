import { getConfigurationSections } from './schema';

export function useMetadataConfiguration(models, schema, definition) {

    if (!models || !schema || !definition) {
        return {};
    }

    const processed = definition.schemaPreprocessor ?
        definition.schemaPreprocessor(schema) : schema;

    return getConfigurationSections(models, definition, processed);
}