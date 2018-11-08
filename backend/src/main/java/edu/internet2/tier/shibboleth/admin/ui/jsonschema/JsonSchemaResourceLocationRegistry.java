package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import java.util.Optional;

/**
 * An API to store and expose JSON schema resource locations for various JSON schema types. Typically configured as a Spring
 * bean and injected into Spring-managed components interested in looking up JSON schema locations by particular type.
 *
 * @author Dmitriy Kopylenko
 */
public interface JsonSchemaResourceLocationRegistry {

    /**
     * Register json schema resource location for given schema type.
     *
     * @param type     of JSON schema
     * @param location of JSON schema resource
     */
    JsonSchemaResourceLocationRegistry register(JsonSchemaResourceLocation.SchemaType type, JsonSchemaResourceLocation location);

    /**
     * Look up json schema resource location by given schema type.
     *
     * @param type type of JSON schema
     * @return optional location of JSON schema resource
     */
    Optional<JsonSchemaResourceLocation> lookup(JsonSchemaResourceLocation.SchemaType type);

    /**
     * Factory method.
     *
     * @return in-memory implementation
     */
    static JsonSchemaResourceLocationRegistry inMemory() {
        return new InMemoryJsonSchemaResourceLocationRegistry();
    }
}
