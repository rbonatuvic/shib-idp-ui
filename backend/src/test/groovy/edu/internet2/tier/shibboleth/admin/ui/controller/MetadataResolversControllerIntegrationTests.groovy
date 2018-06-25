package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver
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

    JsonSlurper jsonSlurper = new JsonSlurper()

    static BASE_URI = '/api/MetadataResolvers'

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

    def "POST new DynamicHttpMetadataResolver -> /api/MetadataResolvers"() {
        given: 'New MetadataResolver JSON representation'
        def resolver = [name: 'Test DynamicHttpMetadataResolver', '@type': 'DynamicHttpMetadataResolver']

        when: 'POST request is made with new DynamicHttpMetadataResolver JSON representation'
        def result = this.restTemplate.postForEntity(BASE_URI, createRequestHttpEntityFor { JsonOutput.toJson(resolver) }, String)

        then:
        result.statusCodeValue == 201
        result.headers.Location[0].contains(BASE_URI)
    }

    def "PUT concrete MetadataResolver with updated changes -> /api/MetadataResolvers/{resourceId}"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
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
        def updatedResolverMap = new JsonSlurper().parseText(updatedResult.body)

        then:
        updatedResult.statusCodeValue == 200
        updatedResolverMap.name == 'Updated DynamicHttpMetadataResolver'

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

    private HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }

    @TestConfiguration
    static class Config {
        @Bean
        MetadataResolver metadataResolver() {
            new FilesystemMetadataResolver(new File('fake'))
        }
    }
}
