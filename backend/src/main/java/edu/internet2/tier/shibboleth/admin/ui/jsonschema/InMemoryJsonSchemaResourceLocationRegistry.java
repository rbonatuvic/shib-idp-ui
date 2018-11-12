package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;

/**
 * Default implementation of {@link JsonSchemaResourceLocationRegistry}.
 * <p>
 * This class has package private visibility as creation of it is delegated to public static factory method
 * on the registry interface itself.
 *
 * @author Dmitriy Kopylenko
 */
class InMemoryJsonSchemaResourceLocationRegistry implements JsonSchemaResourceLocationRegistry {

    private Map<JsonSchemaResourceLocation.SchemaType, JsonSchemaResourceLocation> schemaLocations =
            new EnumMap<>(JsonSchemaResourceLocation.SchemaType.class);


    @Override
    public JsonSchemaResourceLocationRegistry register(JsonSchemaResourceLocation.SchemaType type, JsonSchemaResourceLocation location) {
        this.schemaLocations.put(type, location);
        return this;
    }

    @Override
    public Optional<JsonSchemaResourceLocation> lookup(JsonSchemaResourceLocation.SchemaType type) {
        return Optional.ofNullable(this.schemaLocations.get(type));
    }
}
