package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.ENTITY_ATTRIBUTES_FILTERS;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.EXTERNAL_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.METADATA_SOURCES;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.FILESYSTEM_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.LOCAL_DYNAMIC_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.DYNAMIC_HTTP_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.NAME_ID_FORMAT_FILTER;

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
     * @return entity attributes filters JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation entityAttributesFiltersSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(ENTITY_ATTRIBUTES_FILTERS)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for entity attributes filters is not registered."));
    }

    /**
     * Searches filesystem metadata resolver JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return filesystem metadata resolver JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation filesystemMetadataProviderSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(FILESYSTEM_METADATA_RESOLVER)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for filesystem metadata resolver is not registered."));
    }

    /**
     * Searches local dynamic metadata resolver JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return local dynamic metadata resolver JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation localDynamicMetadataProviderSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(LOCAL_DYNAMIC_METADATA_RESOLVER)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for local dynamic metadata resolver is not registered."));
    }

    /**
     * Searches external metadata resolver JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return external metadata resolver JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation externalMetadataProviderSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(EXTERNAL_METADATA_RESOLVER)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for external metadata resolver is not registered."));
    }

    /**
     * Searches dynamic http metadata resolver JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return dynamic http metadata resolver JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation dynamicHttpMetadataProviderSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                        .lookup(DYNAMIC_HTTP_METADATA_RESOLVER)
                        .orElseThrow(() -> new IllegalStateException("JSON schema resource location for dynamic http metadata resolver is not registered."));
    }

    /**
     * Searches name id format filter JSON schema resource location object in the given location registry.
     *
     * @param resourceLocationRegistry
     * @return name id format filter JSON schema resource location object
     * @throws IllegalStateException if schema is not found in the given registry
     */
    public static JsonSchemaResourceLocation nameIdFormatFilterSchema(JsonSchemaResourceLocationRegistry resourceLocationRegistry) {
        return resourceLocationRegistry
                .lookup(NAME_ID_FORMAT_FILTER)
                .orElseThrow(() -> new IllegalStateException("JSON schema resource location for name id format filter is not registered."));
    }
}