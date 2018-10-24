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

    private Map<JsonSchemaResourceLocation.ShemaType, JsonSchemaResourceLocation> schemaLocations =
            new EnumMap<>(JsonSchemaResourceLocation.ShemaType.class);


    @Override
    public JsonSchemaResourceLocationRegistry register(JsonSchemaResourceLocation.ShemaType type, JsonSchemaResourceLocation location) {
        this.schemaLocations.put(type, location);
        return this;
    }

    @Override
    public Optional<JsonSchemaResourceLocation> lookup(JsonSchemaResourceLocation.ShemaType type) {
        return Optional.ofNullable(this.schemaLocations.get(type));
    }
}
