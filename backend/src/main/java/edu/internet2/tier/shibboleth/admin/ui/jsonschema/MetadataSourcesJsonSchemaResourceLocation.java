package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;

/**
 * Encapsulates metadata sources JSON schema location.
 *
 * @author Dmitriy Kopylenko
 */
public class MetadataSourcesJsonSchemaResourceLocation {

    private final String metadataSourcesUiSchemaLocation;

    private URL jsonSchemaUrl;

    private final ResourceLoader resourceLoader;

    private final ObjectMapper jacksonMapper;

    private boolean detectMalformedJsonDuringInit = true;

    public MetadataSourcesJsonSchemaResourceLocation(String metadataSourcesUiSchemaLocation, ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        this.metadataSourcesUiSchemaLocation = metadataSourcesUiSchemaLocation;
        this.resourceLoader = resourceLoader;
        this.jacksonMapper = jacksonMapper;
    }

    //This constructor is used in tests
    public MetadataSourcesJsonSchemaResourceLocation(String metadataSourcesUiSchemaLocation,
                                                     ResourceLoader resourceLoader,
                                                     ObjectMapper jacksonMapper,
                                                     boolean detectMalformedJsonDuringInit) {
        this.metadataSourcesUiSchemaLocation = metadataSourcesUiSchemaLocation;
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
            this.jsonSchemaUrl = this.resourceLoader.getResource(this.metadataSourcesUiSchemaLocation).getURL();
            if(this.detectMalformedJsonDuringInit) {
                //Detect malformed JSON schema early, during application start up and fail fast with useful exception message
                this.jacksonMapper.readValue(this.jsonSchemaUrl, Map.class);
            }
        }
        catch (Exception ex) {
            StringBuilder msg =
                    new StringBuilder(String.format("An error is detected during JSON parsing => [%s]", ex.getMessage()));
            msg.append(String.format("Offending resource => [%s]", this.metadataSourcesUiSchemaLocation));

            throw new BeanInitializationException(msg.toString(), ex);
        }
    }
}
