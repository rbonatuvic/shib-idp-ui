package edu.internet2.tier.shibboleth.admin.ui.jsonschema;

import org.springframework.beans.factory.BeanCreationException;
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

    ResourceLoader resourceLoader;

    public MetadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
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
        }
        catch (IOException ex) {
            throw new BeanCreationException(ex.getMessage(), ex);
        }
    }
}
