package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation
import org.springframework.beans.factory.BeanInitializationException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
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

    @Autowired
    MetadataSourcesJsonSchemaResourceLocation schemaLocation

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
        configureMalformedJsonInput(simulateApplicationStartup { false })
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: "Request results in HTTP 500"
        result.statusCodeValue == 500
        result.body.jsonParseError
        result.body.sourceUiSchemaDefinitionFile
    }

    def "Malformed Metadata Sources UI definition schema is detected during application start up"() {
        when: 'Application is starting up and malformed JSON schema is detected'
        configureMalformedJsonInput(simulateApplicationStartup { true })

        then:
        def ex = thrown(BeanInitializationException)
        ex.message.contains('An error is detected during JSON parsing =>')
        ex.message.contains('Offending resource =>')

    }

    private configureMalformedJsonInput(boolean simulateApplicationStartup) {
        schemaLocation.metadataSourcesUiSchemaLocation = 'classpath:metadata-sources-ui-schema_MALFORMED.json'
        try {
            schemaLocation.init()
        }
        catch (Exception e) {
            if (simulateApplicationStartup) {
                throw e
            }
        }

    }

    //Just for the nicer, readable, DSL-like
    private static boolean simulateApplicationStartup(Closure booleanFlagSupplier) {
        booleanFlagSupplier()
    }
}