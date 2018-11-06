package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.ENTITY_ATTRIBUTES_FILTERS;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.METADATA_SOURCES;

/**
 * Utility methods for common JSON schema types lookups.
 *
 * @author Dmitriy Kopylenko
 */
public abstract class JsonSchemaLocationLookup {

    /**
     * Searches metadata sources JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return metadata sources JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation metadataSourcesSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(METADATA_SOURCES)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for metadata sources is not registered."));
    }

    /**
     * Searches entity attributes filters JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @returnentity attributes filters JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation entityAttributesFiltersSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(ENTITY_ATTRIBUTES_FILTERS)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for metadata sources is not registered."));
    }
}
