package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.*;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.ShemaType.ENTITY_ATTRIBUTES_FILTERS;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.ShemaType.METADATA_SOURCES;

/**
 * @author Dmitriy Kopylenko
 */
@Configuration
@ConfigurationProperties("shibui")
public class JsonSchemaComponentsConfiguration {

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.metadata-sources-ui-schema-location' property and default
    //value set here if that property is not explicitly set in application.properties
    @Setter
    private String metadataSourcesUiSchemaLocation = "classpath:metadata-sources-ui-schema.json";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.entity-attributes-filters-ui-schema-location' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String entityAttributesFiltersUiSchemaLocation = "classpath:entity-attributes-filters-ui-schema.json";

    @Bean
    public JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry(ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {
        return JsonSchemaResourceLocationRegistry.inMemory()
                .register(METADATA_SOURCES, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(metadataSourcesUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build())
                .register(ENTITY_ATTRIBUTES_FILTERS, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(entityAttributesFiltersUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build());

    }
}
