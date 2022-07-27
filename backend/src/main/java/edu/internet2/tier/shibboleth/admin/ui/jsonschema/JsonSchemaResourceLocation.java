package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Encapsulates arbitrary JSON schema location.
 *
 * @author Dmitriy Kopylenko
 */
public class JsonSchemaResourceLocation {

    private final String jsonSchemaLocation;

    private URL jsonSchemaUrl;

    private final ResourceLoader resourceLoader;

    private final ObjectMapper jacksonMapper;

    private boolean detectMalformedJsonDuringInit = true;

    public JsonSchemaResourceLocation(String jsonSchemaLocation, ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        this.jsonSchemaLocation = jsonSchemaLocation;
        this.resourceLoader = resourceLoader;
        this.jacksonMapper = jacksonMapper;
    }

    public JsonSchemaResourceLocation(String jsonSchemaLocation,
                                      ResourceLoader resourceLoader,
                                      ObjectMapper jacksonMapper,
                                      boolean detectMalformedJsonDuringInit) {

        this.jsonSchemaLocation = jsonSchemaLocation;
        this.resourceLoader = resourceLoader;
        this.jacksonMapper = jacksonMapper;
        this.detectMalformedJsonDuringInit = detectMalformedJsonDuringInit;
    }

    public URL getUrl() {
        return this.jsonSchemaUrl;
    }

    public URI getUri() {
        try {
            return this.jsonSchemaUrl.toURI();
        }
        catch (URISyntaxException ex) {
            throw new RuntimeException(ex);
        }
    }

    @PostConstruct
    public void init() {
        try {
            this.jsonSchemaUrl = this.resourceLoader.getResource(this.jsonSchemaLocation).getURL();
            if(this.detectMalformedJsonDuringInit) {
                //Detect malformed JSON schema early, during application start up and fail fast with useful exception message
                this.jacksonMapper.readValue(this.jsonSchemaUrl, Map.class);
            }
        }
        catch (Exception ex) {
            StringBuilder msg =
                    new StringBuilder(String.format("An error is detected during JSON parsing => [%s]", ex.getMessage()));
            msg.append(String.format("Offending resource => [%s]", this.jsonSchemaLocation));

            throw new BeanInitializationException(msg.toString(), ex);
        }
    }

    public static class JsonSchemaLocationBuilder {

        @Builder(builderMethodName = "with")
        public static JsonSchemaResourceLocation newSchemaLocation(String jsonSchemaLocation,
                                                                   ResourceLoader resourceLoader,
                                                                   ObjectMapper jacksonMapper,
                                                                   boolean detectMalformedJson) {
            JsonSchemaResourceLocation location = new JsonSchemaResourceLocation(jsonSchemaLocation, resourceLoader, jacksonMapper, detectMalformedJson);
            location.init();
            return location;
        }
    }

    public enum SchemaType {
        // common types
        METADATA_SOURCES("MetadataSources"),

        // filter types
        ENTITY_ATTRIBUTES_FILTERS("EntityAttributesFilters"),
        NAME_ID_FORMAT_FILTER("NameIdFormatFilter"),

         // resolver types
        FILE_BACKED_HTTP_METADATA_RESOLVER("FileBackedHttpMetadataResolver"),
        FILESYSTEM_METADATA_RESOLVER("FilesystemMetadataResolver"),
        LOCAL_DYNAMIC_METADATA_RESOLVER("LocalDynamicMetadataResolver"),
        DYNAMIC_HTTP_METADATA_RESOLVER("DynamicHttpMetadataResolver"),
        EXTERNAL_METADATA_RESOLVER("ExternalMetadataResolver");

        String jsonType;

        SchemaType(String jsonType) {
            this.jsonType = jsonType;
        }

        String getJsonType() {
            return jsonType;
        }

        public static List<String> getResolverTypes() {
            return Stream.of(SchemaType.values()).map(SchemaType::getJsonType).filter(it -> it.endsWith("Resolver")).collect(Collectors.toList());
        }

        public static SchemaType getSchemaType(String jsonType) {
            List<SchemaType> schemaTypes = Stream.of(SchemaType.values()).filter(it -> it.getJsonType().equals(jsonType)).collect(Collectors.toList());
            if (schemaTypes.size() > 1) {
                throw new RuntimeException("Found multiple schema types for jsonType (" + jsonType + ")!");
            } else if (schemaTypes.size() == 0) {
                throw new RuntimeException("Found no schema types for jsonType (" + jsonType + ")! Verify that the code supports all schema types.");
            } else {
                return schemaTypes.get(0);
            }
        }
    }
}