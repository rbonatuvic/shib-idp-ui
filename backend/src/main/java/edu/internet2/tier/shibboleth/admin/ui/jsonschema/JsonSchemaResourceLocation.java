package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Builder;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;

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

    //This constructor is used in tests
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
        METADATA_SOURCES, ENTITY_ATTRIBUTES_FILTERS
    }
}