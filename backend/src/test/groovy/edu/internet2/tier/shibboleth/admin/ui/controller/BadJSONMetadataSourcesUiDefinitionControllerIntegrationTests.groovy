package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ResourceLoader
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
class BadJSONMetadataSourcesUiDefinitionControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataSourcesJsonSchemaResourceLocation schemaLocation

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
    static class Config {
        @Bean
        MetadataSourcesJsonSchemaResourceLocation metadataSourcesJsonSchemaResourceLocation(ResourceLoader resourceLoader,
                                                                                            ObjectMapper jacksonMapper) {

            new MetadataSourcesJsonSchemaResourceLocation('classpath:metadata-sources-ui-schema_MALFORMED.json',
                    resourceLoader, jacksonMapper, false)
        }
    }
}