import { getConfigurationSections, getLimitedProperties } from './schema';

export const getLimitedConfigurationsFn = (configurations, limited) => {
    return configurations ? ({
        ...configurations,
        sections: !limited ? configurations.sections :
            configurations.sections.map(s => ({
                ...s,
                properties: getLimitedProperties(s.properties),
            }))
    }) : configurations;
};


export function useMetadataConfiguration(models, schema, definition, limited = false) {

    if (!models || !schema || !definition) {
        return {};
    }

    return getLimitedConfigurationsFn(getConfigurationSections(models, definition, definition.overrideSchema ? definition.overrideSchema(schema, models) : schema), limited);
}
