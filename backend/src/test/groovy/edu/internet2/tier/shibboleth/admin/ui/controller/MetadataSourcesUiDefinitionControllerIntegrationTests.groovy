package edu.internet2.tier.shibboleth.admin.ui.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
class MetadataSourcesUiDefinitionControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataSourcesUiDefinitionController controllerUnderTest

    static RESOURCE_URI = '/api/ui/MetadataSources'

    def "GET Metadata Sources UI definition schema"() {
        when: 'GET request is made for metadata source UI definition schema'

        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: "Request completed successfully"
        result.statusCodeValue == 200
        result.body.properties.entityId.title == 'label.entity-id'
    }

    def "GET Malformed Metadata Sources UI definition schema"() {
        when: 'GET request is made for malformed metadata source UI definition schema'
        configureMalformedJsonInput()
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: "Request results in HTTP 400"
        result.statusCodeValue == 200
    }

    private configureMalformedJsonInput() {
        controllerUnderTest.metadataSourcesUiSchemaLocation = 'classpath:metadata-sources-ui-schema_BAD.json'
        controllerUnderTest.init()
    }
}