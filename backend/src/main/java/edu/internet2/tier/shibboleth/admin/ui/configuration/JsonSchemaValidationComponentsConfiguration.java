package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

/**
 * @author Dmitriy Kopylenko
 */
@Configuration
public class JsonSchemaValidationComponentsConfiguration {

    @Bean
    public MetadataSourcesJsonSchemaResourceLocation metadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        return new MetadataSourcesJsonSchemaResourceLocation(resourceLoader, jacksonMapper);
    }
}
