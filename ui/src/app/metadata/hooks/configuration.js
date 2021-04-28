import React from 'react';

import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { getConfigurationSections } from './schema';

export function useMetadataConfiguration(models) {
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);

    const processed = definition.schemaPreprocessor ?
        definition.schemaPreprocessor(schema) : schema;

    return getConfigurationSections(models, definition, processed);
}