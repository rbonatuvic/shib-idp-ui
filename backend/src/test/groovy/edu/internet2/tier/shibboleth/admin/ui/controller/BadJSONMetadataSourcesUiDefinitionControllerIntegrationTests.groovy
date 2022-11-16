package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Profile
import org.springframework.core.io.ResourceLoader
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.JsonSchemaLocationBuilder
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.ALGORITHM_FILTER
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.DYNAMIC_HTTP_METADATA_RESOLVER
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.DYNAMIC_REGISTRATION
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.ENTITY_ATTRIBUTES_FILTERS
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.FILESYSTEM_METADATA_RESOLVER
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.LOCAL_DYNAMIC_METADATA_RESOLVER
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.METADATA_SOURCES_OIDC
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.METADATA_SOURCES_SAML
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType.NAME_ID_FORMAT_FILTER

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(["no-auth", "badjson"])
class BadJSONMetadataSourcesUiDefinitionControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    static RESOURCE_URI = '/api/ui/MetadataSources'

    def "GET Malformed Metadata Sources UI definition schema"() {
        when: 'GET request is made for malformed metadata source UI definition schema'
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: "Request results in HTTP 500"
        result.statusCodeValue == 500
        result.body.jsonParseError
        result.body.sourceUiSchemaDefinitionFile
    }

    @TestConfiguration
    @Profile('badjson')
    static class Config {
        @Bean
        JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry(ResourceLoader resourceLoader, ObjectMapper jacksonMapper) {

            JsonSchemaResourceLocationRegistry.inMemory()
                .register(METADATA_SOURCES_OIDC, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:metadata-sources-ui-schema_MALFORMED.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(METADATA_SOURCES_SAML, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:metadata-sources-ui-schema_MALFORMED.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                //TODO Maybe we need a separate test config here so we don't have to define all of the locations?
                .register(ENTITY_ATTRIBUTES_FILTERS, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:entity-attributes-filters-ui-schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(FILESYSTEM_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:file-system-metadata-provider.schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(LOCAL_DYNAMIC_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:local-dynamic-metadata-provider.schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(DYNAMIC_HTTP_METADATA_RESOLVER, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:dynamic-http-metadata-provider.schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(NAME_ID_FORMAT_FILTER, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:nameid-filter.schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(ALGORITHM_FILTER, JsonSchemaLocationBuilder.with()
                    .jsonSchemaLocation('classpath:algorithm-filter.schema.json')
                    .resourceLoader(resourceLoader)
                    .jacksonMapper(jacksonMapper)
                    .detectMalformedJson(false)
                    .build())
                .register(DYNAMIC_REGISTRATION, JsonSchemaLocationBuilder.with()
                        .jsonSchemaLocation('classpath:dynamic-registration.schema.json')
                        .resourceLoader(resourceLoader)
                        .jacksonMapper(jacksonMapper)
                        .detectMalformedJson(false)
                        .build())
        }
    }
}