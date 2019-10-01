export const metadataFilterProcessor = (schema) => {
    if (!schema) {
        return null;
    }
    if (!schema.properties || !schema.properties.metadataFilters) {
        return schema;
    }
    const filters = schema.properties.metadataFilters;
    const processed = ({
        ...schema,
        properties: {
            ...schema.properties,
            metadataFilters: {
                type: 'object',
                properties: filters.items.reduce((collection, filterType) => ({
                    ...collection,
                    [filterType.$id]: filterType
                }), {})
            }
        }
    });
    return processed;
};
