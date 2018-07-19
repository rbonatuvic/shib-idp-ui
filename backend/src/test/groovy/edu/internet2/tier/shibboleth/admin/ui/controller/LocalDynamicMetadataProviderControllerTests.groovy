package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.repository.LocalDynamicMetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import spock.lang.Specification

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class LocalDynamicMetadataProviderControllerTests extends Specification {
    RandomGenerator randomGenerator
    TestObjectGenerator testObjectGenerator
    ObjectMapper mapper

    def repository = Mock(LocalDynamicMetadataResolverRepository)
    def controller
    def mockMvc

    @Autowired
    AttributeUtility attributeUtility

    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility)
        mapper = new ObjectMapper()

        controller = new LocalDynamicMetadataProviderController (
                repository: repository
        )

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    def "DELETE deletes the desired resolver"() {
        given:
        def randomResourceId = randomGenerator.randomId()

        1 * repository.deleteByResourceId(randomResourceId) >> true

        when:
        def result = mockMvc.perform(
                delete("/api/MetadataProvider/LocalDynamic/$randomResourceId"))

        then:
        result.andExpect(status().isAccepted())
    }

    def "DELETE returns error when desired resolver is not found"() {
        given:
        def randomResourceId = randomGenerator.randomId()

        1 * repository.deleteByResourceId(randomResourceId) >> false

        when:
        def result = mockMvc.perform(
                delete("/api/MetadataProvider/LocalDynamic/$randomResourceId"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "POST a new resolver properly persists and returns the new persisted resolver"() {
        given:
        def resolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        resolver.version = resolver.hashCode()
        def postedJsonBody = mapper.writeValueAsString(resolver)

        1 * repository.findByName(resolver.getName()) >> null
        1 * repository.save(_) >> resolver

        def expectedResolverUUID = resolver.getResourceId()
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/MetadataProvider/LocalDynamic/$expectedResolverUUID"

        when:
        def result = mockMvc.perform(
                post('/api/MetadataProvider/LocalDynamic')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
                .andExpect(content().json(postedJsonBody, false))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
    }

    def "POST a new resolver that has a name of a persisted resolver returns conflict"() {
        given:
        def resolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        resolver.version = resolver.hashCode()
        def postedJsonBody = mapper.writeValueAsString(resolver)

        1 * repository.findByName(resolver.name) >> resolver
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                post('/api/MetadataProvider/LocalDynamic')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isConflict())
    }

    def "GET by resourceId returns the desired persisted resolver"() {
        given:
        def resolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        resolver.version = resolver.hashCode()
        def resolverJson = mapper.writeValueAsString(resolver)
        def resolverId = resolver.resourceId

        1 * repository.findByResourceId(resolverId) >> resolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/LocalDynamic/$resolverId"))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(resolverJson, false))
    }

    def "GET by unknown resource id returns not found"() {
        given:
        def randomResourceId = randomGenerator.randomId()

        1 * repository.findByResourceId(randomResourceId) >> null

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/LocalDynamic/$randomResourceId"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "GET by resolver name returns the desired persisted resolver"() {
        given:
        def resolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        resolver.version = resolver.hashCode()
        def resolverName = resolver.name
        def resolverJson = mapper.writeValueAsString(resolver)

        1 * repository.findByName(resolverName) >> resolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/LocalDynamic/name/$resolverName"))

        then:
        result.andExpect(status().isOk())
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(resolverJson, false))
    }

    def "GET by unknown resolver name returns not found"() {
        given:
        def randomResolverName = randomGenerator.randomString(10)

        1 * repository.findByName(randomResolverName) >> null

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/LocalDynamic/name/$randomResolverName"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "PUT allows for a successful update of an already-persisted resolver"() {
        given:
        def existingResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        existingResolver.version = existingResolver.hashCode()
        def resourceId = existingResolver.resourceId
        def updatedResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        updatedResolver.setResourceId(resourceId)
        updatedResolver.setVersion(existingResolver.hashCode())
        def postedJsonBody = mapper.writeValueAsString(updatedResolver)

        1 * repository.findByResourceId(resourceId) >> existingResolver
        1 * repository.save(_) >> updatedResolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/LocalDynamic')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        def expectedJson = new JsonSlurper().parseText(postedJsonBody)
        expectedJson << [version: updatedResolver.hashCode()]
        result.andExpect(status().isOk())
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(JsonOutput.toJson(expectedJson), false))
    }

    def "PUT of an updated resolver with an incorrect version returns a conflict"() {
        given:
        def existingResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        existingResolver.version = existingResolver.hashCode()
        def resourceId = existingResolver.resourceId

        def updatedResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        updatedResolver.resourceId = resourceId
        updatedResolver.version = updatedResolver.hashCode()
        def postedJsonBody = mapper.writeValueAsString(updatedResolver)

        1 * repository.findByResourceId(resourceId) >> existingResolver
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/LocalDynamic')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isConflict())
    }

    def "PUT of a resolver that is not persisted returns not found"() {
        given:
        def existingResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        existingResolver.version = existingResolver.hashCode()
        def resourceId = existingResolver.resourceId

        def updatedResolver = testObjectGenerator.buildLocalDynamicMetadataResolver()
        updatedResolver.resourceId = resourceId
        updatedResolver.version = updatedResolver.hashCode()
        def postedJsonBody = mapper.writeValueAsString(updatedResolver)

        1 * repository.findByResourceId(resourceId) >> null
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/LocalDynamic')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isNotFound())
    }
}
