package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.context.annotation.Bean
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification
import spock.lang.Unroll

import static org.springframework.http.HttpMethod.PUT

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("no-auth")
class MetadataResolversControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    ObjectMapper mapper
    TestObjectGenerator generator

    JsonSlurper jsonSlurper = new JsonSlurper()

    static BASE_URI = '/api/MetadataResolvers'

    def setup() {
        generator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.registerModule(new JavaTimeModule())
    }

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    def "GET empty -> /api/MetadataResolvers"() {
        when: 'No resolvers are available in data store'
        def result = this.restTemplate.getForEntity(BASE_URI, String)
        def returnedResolvers = jsonSlurper.parseText(result.body)

        then:
        result.statusCodeValue == 200
        returnedResolvers.size() == 0
    }

    def "GET one available MetadataResolver -> /api/MetadataResolvers"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        metadataResolverRepository.save(resolver)

        when: 'GET request is made'
        def result = this.restTemplate.getForEntity(BASE_URI, String)
        def returnedResolvers = jsonSlurper.parseText(result.body)

        then:
        result.statusCodeValue == 200
        returnedResolvers.size() == 1
        returnedResolvers[0]['@type'] == 'DynamicHttpMetadataResolver'
        returnedResolvers[0].name == 'Test DynamicHttpMetadataResolver'

    }

    def "GET multiple available MetadataResolvers -> /api/MetadataResolvers"() {
        given: 'Two resolvers are available in data store'
        def resolvers = [
                new DynamicHttpMetadataResolver().with {
                    it.name = 'Test DynamicHttpMetadataResolver'
                    it
                },
                new FileBackedHttpMetadataResolver().with {
                    it.name = 'Test FileBackedHttpMetadataResolver'
                    it
                }
        ]
        resolvers.each {
            metadataResolverRepository.save(it)
        }

        when: 'GET request is made'
        def result = this.restTemplate.getForEntity(BASE_URI, String)
        def returnedResolvers = jsonSlurper.parseText(result.body)

        then:
        result.statusCodeValue == 200
        returnedResolvers.size() == 2
        returnedResolvers[0]['@type'] == 'DynamicHttpMetadataResolver'
        returnedResolvers[0].name == 'Test DynamicHttpMetadataResolver'
        returnedResolvers[1]['@type'] == 'FileBackedHttpMetadataResolver'
        returnedResolvers[1].name == 'Test FileBackedHttpMetadataResolver'

    }

    def "GET concrete MetadataResolver -> /api/MetadataResolvers/{resourceId}"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", String)
        def returnedResolver = jsonSlurper.parseText(result.body)

        then:
        result.statusCodeValue == 200
        returnedResolver['@type'] == 'DynamicHttpMetadataResolver'
        returnedResolver.name == 'Test DynamicHttpMetadataResolver'

    }

    def "GET non-existent MetadataResolver -> /api/MetadataResolvers/{resourceId}"() {
        when: 'GET request is made with resource Id not matching any resolvers'
        def result = this.restTemplate.getForEntity("$BASE_URI/bogus-resource-id", String)

        then:
        result.statusCodeValue == 404
    }

    @DirtiesContext
    def "SHIBUI-839 - POST resolver with spaces in the provider name results in trimmed name"() {
        given:
        def resolver = generator.buildRandomMetadataResolverOfType('DynamicHttp')
        resolver.name = '   This name has spaces    '
        def expectedName = 'This name has spaces'

        when:
        def result = this.restTemplate.postForEntity(BASE_URI, createRequestHttpEntityFor { mapper.writeValueAsString(resolver) }, String)

        then:
        def metadataResolverMap = new JsonSlurper().parseText(result.body)
        metadataResolverMap.name == expectedName
    }

    @Unroll
    @DirtiesContext
    def "POST new concrete MetadataResolver of type #resolverType -> /api/MetadataResolvers"(String resolverType) {
        given: 'New MetadataResolver JSON representation'
        def resolver = generator.buildRandomMetadataResolverOfType(resolverType)
        String sourceDirectory
        if (resolverType.equals('LocalDynamic')) {
            sourceDirectory = ((LocalDynamicMetadataResolver) resolver).sourceDirectory
        }

        when: 'POST request is made with new DynamicHttpMetadataResolver JSON representation'
        def result = this.restTemplate.postForEntity(BASE_URI, createRequestHttpEntityFor { mapper.writeValueAsString(resolver) }, String)

        then:
        result.statusCodeValue == 201
        result.headers.Location[0].contains(BASE_URI)

        cleanup:
        if (sourceDirectory != null) {
            def tmpDirectory = new File(sourceDirectory)
            if (tmpDirectory.exists()) {
                tmpDirectory.deleteDir()
            }
        }

        where:
            resolverType     | _
            'DynamicHttp'    | _
            'FileBacked'     | _
            'LocalDynamic'   | _
            'ResourceBacked' | _
            'Filesystem'     | _
    }

    @Unroll
    def "PUT concrete MetadataResolver of type #resolverType with updated changes -> /api/MetadataResolvers/{resourceId}"(String resolverType) {
        given: 'One resolver is available in data store'
        def resolver = generator.buildRandomMetadataResolverOfType(resolverType)
        String sourceDirectory
        if (resolverType.equals('Localdynamic')) {
            sourceDirectory = ((LocalDynamicMetadataResolver) resolver).sourceDirectory
        }
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", String)

        and: 'Resolver data is updated and sent back to the server'
        def metadataResolverMap = new JsonSlurper().parseText(result.body)
        metadataResolverMap.name = 'Updated DynamicHttpMetadataResolver'
        def updatedResult = this.restTemplate.exchange(
                "$BASE_URI/${metadataResolverMap.resourceId}",
                PUT,
                createRequestHttpEntityFor { JsonOutput.toJson(metadataResolverMap) },
                String)
        then:
        updatedResult.statusCodeValue == 200

        and:
        def updatedResolverMap = new JsonSlurper().parseText(updatedResult.body)

        then:
        updatedResolverMap.name == 'Updated DynamicHttpMetadataResolver'

        cleanup:
        if (sourceDirectory != null) {
            def tmpDirectory = new File(sourceDirectory)
            if (tmpDirectory.exists()) {
                tmpDirectory.deleteDir()
            }
        }

        where:
            resolverType     | _
            'DynamicHttp'    | _
            'FileBacked'     | _
            'LocalDynamic'   | _
            'ResourceBacked' | _
            'Filesystem'     | _
    }

    def "PUT concrete MetadataResolver with version conflict -> /api/MetadataResolvers/{resourceId}"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        def resolverResourceId = resolver.resourceId
        def persistedResolver = metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", String)

        and: 'Resolver data is updated and sent back to the server, but then original resolver is changed in data store'
        persistedResolver.name = 'Some other name'
        metadataResolverRepository.save(persistedResolver)
        def metadataResolverMap = new JsonSlurper().parseText(result.body)
        metadataResolverMap.name = 'Updated DynamicHttpMetadataResolver'
        def updatedResult = this.restTemplate.exchange(
                "$BASE_URI/${metadataResolverMap.resourceId}",
                PUT,
                createRequestHttpEntityFor { JsonOutput.toJson(metadataResolverMap) },
                String)

        then:
        updatedResult.statusCodeValue == 409
    }

    def "POST new MetadataResolver with one EntityAttributesFilters attached -> /api/MetadataResolvers"() {
        given: 'New MetadataResolver with attached entity attributes filter JSON representation'
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters << generator.entityAttributesFilter()

        when: 'POST request is made with new FileBackedMetadataResolver with EntityAttributesFilter JSON representation'
        def result = this.restTemplate.postForEntity(BASE_URI, createRequestHttpEntityFor { mapper.writeValueAsString(resolver) }, String)

        then:
        result.statusCodeValue == 201
        result.headers.Location[0].contains(BASE_URI)

        when: 'Query REST API for newly created resolver'
        def createdResolverResult = this.restTemplate.getForEntity(result.headers.Location[0], String)
        def createdResolver = mapper.readValue(createdResolverResult.body, edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver)

        then:
        createdResolver.metadataFilters.size() == 1
        createdResolver.metadataFilters[0] instanceof EntityAttributesFilter
    }

    def "PUT MetadataResolver with one EntityAttributesFilters attached and check version -> /api/MetadataResolvers"() {
        given: 'MetadataResolver with attached entity attributes is available in data store'
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters << generator.entityAttributesFilter()
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", String)
        def existingMetadataResolverMap = new JsonSlurper().parseText(result.body)
        def existingMetadataVersion = existingMetadataResolverMap.version

        and: 'PUT call is made with'
        existingMetadataResolverMap.name = 'Updated'
        def updatedResultFromPUT = this.restTemplate.exchange(
                "$BASE_URI/${existingMetadataResolverMap.resourceId}",
                PUT,
                createRequestHttpEntityFor { JsonOutput.toJson(existingMetadataResolverMap) },
                String)
        def updatedResultFromGET = this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", String)
        def updatedVersionReturnedFromPUT = new JsonSlurper().parseText(updatedResultFromPUT.body).version
        def updatedVersionReturnedFromGET = new JsonSlurper().parseText(updatedResultFromGET.body).version

        then:
        updatedVersionReturnedFromPUT == updatedVersionReturnedFromGET
    }

    private HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }

    @TestConfiguration
    static class Config {
        @Bean
        MetadataResolver metadataResolver() {
            new OpenSamlChainingMetadataResolver()
        }
    }
}
