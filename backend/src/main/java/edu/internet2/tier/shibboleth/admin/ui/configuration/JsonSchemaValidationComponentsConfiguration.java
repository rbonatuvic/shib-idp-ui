package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

/**
 * @author Dmitriy Kopylenko
 */
@Configuration
@ConfigurationProperties("shibui")
public class JsonSchemaValidationComponentsConfiguration {

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.metadata-sources-ui-schema-location' property and default
    //value set here if that property is not explicitly set in application.properties
    private String metadataSourcesUiSchemaLocation ="classpath:metadata-sources-ui-schema.json";

    //This setter is used by Boot's @ConfiguratonProperties binding machinery
    public void setMetadataSourcesUiSchemaLocation(String metadataSourcesUiSchemaLocation) {
        this.metadataSourcesUiSchemaLocation = metadataSourcesUiSchemaLocation;
    }

    @Bean
    public MetadataSourcesJsonSchemaResourceLocation metadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        return new MetadataSourcesJsonSchemaResourceLocation(metadataSourcesUiSchemaLocation, resourceLoader, jacksonMapper);
    }
}
