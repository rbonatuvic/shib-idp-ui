package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.BeanCreationException;
import org.springframework.beans.factory.BeanInitializationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;

/**
 * Encapsulates metadata sources JSON schema location.
 *
 * @author Dmitriy Kopylenko
 */
@ConfigurationProperties("shibui")
public class MetadataSourcesJsonSchemaResourceLocation {

    //Configured via @ConfigurationProperties with 'shibui.metadata-sources-ui-schema-location' property and default
    //value set here if that property is not explicitly set in application.properties
    private String metadataSourcesUiSchemaLocation = "classpath:metadata-sources-ui-schema.json";

    private URL jsonSchemaUrl;

    private ResourceLoader resourceLoader;

    private ObjectMapper jacksonMapper;



    public MetadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        this.resourceLoader = resourceLoader;
        this.jacksonMapper = jacksonMapper;
    }

    public void setMetadataSourcesUiSchemaLocation(String metadataSourcesUiSchemaLocation) {
        this.metadataSourcesUiSchemaLocation = metadataSourcesUiSchemaLocation;
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
            //Detect malformed JSON schema early, during application start up and fail fast with useful exception message
            this.jacksonMapper.readValue(this.jsonSchemaUrl, Map.class);
        }
        catch (Exception ex) {
            StringBuilder msg =
                    new StringBuilder(String.format("An error is detected during JSON parsing => [%s]", ex.getMessage()));
            msg.append(String.format("Offending resource => [%s]", this.metadataSourcesUiSchemaLocation));

            throw new BeanInitializationException(msg.toString(), ex);
        }
    }
}