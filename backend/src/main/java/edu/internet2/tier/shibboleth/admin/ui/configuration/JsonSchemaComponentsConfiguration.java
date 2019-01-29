package edu.internet2.tier.shibboleth.admin.ui.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.JsonSchemaBuilderService;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ResourceLoader;

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.*;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.ENTITY_ATTRIBUTES_FILTERS;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.METADATA_SOURCES;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.FILESYSTEM_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.LOCAL_DYNAMIC_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.DYNAMIC_HTTP_METADATA_RESOLVER;
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.NAME_ID_FORMAT_FILTER;

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

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.filesystem-metadata-provider-ui-schema-location' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String filesystemMetadataResolverUiSchemaLocation = "classpath:file-system-metadata-provider.schema.json";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.local-dynamic-metadata-provider-ui-schema-location' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String localDynamicMetadataResolverUiSchemaLocation = "classpath:local-dynamic-metadata-provider.schema.json";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.dynamic-http-metadata-provider-ui-schema-location' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String dynamicHttpMetadataResolverUiSchemaLocation = "classpath:dynamic-http-metadata-provider.schema.json";

    //Configured via @ConfigurationProperties (using setter method) with 'shibui.nameid-filter-ui-schema-location' property and
    // default value set here if that property is not explicitly set in application.properties
    @Setter
    private String nameIdFormatFilterUiSchemaLocation = "classpath:nameid-filter.schema.json";

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
                        .build())
                .register(FILESYSTEM_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(filesystemMetadataResolverUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build())
                .register(LOCAL_DYNAMIC_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(localDynamicMetadataResolverUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build())
                .register(DYNAMIC_HTTP_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(dynamicHttpMetadataResolverUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build())
                .register(NAME_ID_FORMAT_FILTER, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation(nameIdFormatFilterUiSchemaLocation)
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(true)
                        .build());
    }

    @Bean
    public JsonSchemaBuilderService jsonSchemaBuilderService(UserService userService) {
        return new JsonSchemaBuilderService(userService);
    }
}
