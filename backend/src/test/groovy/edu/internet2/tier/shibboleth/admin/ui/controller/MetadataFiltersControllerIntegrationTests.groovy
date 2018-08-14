package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

import static org.springframework.http.HttpMethod.PUT

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
class MetadataFiltersControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    AttributeUtility attributeUtility

    ObjectMapper mapper
    TestObjectGenerator generator

    JsonSlurper jsonSlurper = new JsonSlurper()

    static BASE_URI = '/api/MetadataResolvers'

    def setup() {
        generator = new TestObjectGenerator(attributeUtility)
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.registerModule(new JavaTimeModule())
    }

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    def "PUT EntityAttributesFilter"() {
        given: 'MetadataResolver with attached entity attributes is available in data store'
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters << generator.entityAttributesFilter()
        def filterResourceId = resolver.metadataFilters[0].resourceId
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)


        when: 'GET request is made with resource Id matching the existing filter'
        def result = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId/Filters/$filterResourceId", String)
        def existingFilterMap = jsonSlurper.parseText(result.body)

        and: 'PUT call is made with unmodified filter state'
        def updatedResultFromPUT = this.restTemplate.exchange(
                "$BASE_URI/$resolverResourceId/Filters/$filterResourceId",
                PUT,
                createRequestHttpEntityFor { JsonOutput.toJson(existingFilterMap) }, String)

        then:
        updatedResultFromPUT.statusCode.value() == 200
    }

    private HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }

    @TestConfiguration
    static class Config {
        @Bean
        MetadataResolver metadataResolver() {
            new ChainingMetadataResolver().with {
                it.id = 'tester'
                it.initialize()
                return it
            }
        }
    }
}