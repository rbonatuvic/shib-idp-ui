package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.FileBackedHttpMetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
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
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class FileBackedHttpMetadataProviderControllerTests extends Specification {
    RandomGenerator randomGenerator
    ObjectMapper mapper

    def repository = Mock(FileBackedHttpMetadataResolverRepository)
    def controller
    def mockMvc

    def setup() {
        randomGenerator = new RandomGenerator()
        mapper = new ObjectMapper()

        controller = new FileBackedHttpMetadataProviderController (
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
                delete("/api/MetadataProvider/FileBackedHttp/$randomResourceId"))

        then:
        result.andExpect(status().isAccepted())
    }

    def "DELETE returns error when desired resolver is not found"() {
        given:
        def randomResourceId = randomGenerator.randomId()

        1 * repository.deleteByResourceId(randomResourceId) >> false

        when:
        def result = mockMvc.perform(
                delete("/api/MetadataProvider/FileBackedHttp/$randomResourceId"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "POST a new resolver properly persists and returns the new persisted resolver"() {
        given:
        def postedJsonBody = '''{
	"name": "name",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}'''
        def resolver = new ObjectMapper().readValue(postedJsonBody.bytes, FileBackedHttpMetadataResolver)
        1 * repository.findByName(resolver.getName()) >> null
        1 * repository.save(_) >> resolver

        def expectedResolverUUID = resolver.getResourceId()
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/MetadataProvider/FileBackedHttp/$expectedResolverUUID"

        when:
        def result = mockMvc.perform(
                post('/api/MetadataProvider/FileBackedHttp')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
                .andExpect(content().json(postedJsonBody, false))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))

    }

    def "POST a new resolver that has a name of a persisted resolver returns conflict"() {
        given:
        def randomResolverName = randomGenerator.randomString(10)
        def postedJsonBody = """{
	"name": "$randomResolverName",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        def resolver = new ObjectMapper().readValue(postedJsonBody.bytes, FileBackedHttpMetadataResolver)
        1 * repository.findByName(randomResolverName) >> resolver
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                post('/api/MetadataProvider/FileBackedHttp')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isConflict())
    }

    def "GET by resourceId returns the desired persisted resolver"() {
        given:
        def randomUUID = randomGenerator.randomId()
        def resolverJson = """{
	"name": "name",
	"resourceId": "$randomUUID",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""

        def resolver = new ObjectMapper().readValue(resolverJson.bytes, FileBackedHttpMetadataResolver)
        resolver.setResourceId(randomUUID)

        1 * repository.findByResourceId(randomUUID) >> resolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/FileBackedHttp/$randomUUID"))

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
                get("/api/MetadataProvider/FileBackedHttp/$randomResourceId"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "GET by resolver name returns the desired persisted resolver"() {
        given:
        def randomResolverName = randomGenerator.randomString(10)
        def resolverJson = """{
	"name": "$randomResolverName",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""

        def resolver = new ObjectMapper().readValue(resolverJson.bytes, FileBackedHttpMetadataResolver)

        1 * repository.findByName(randomResolverName) >> resolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                get("/api/MetadataProvider/FileBackedHttp/name/$randomResolverName"))

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
                get("/api/MetadataProvider/FileBackedHttp/name/$randomResolverName"))

        then:
        result.andExpect(status().isNotFound())
    }

    def "PUT allows for a successful update of an already-persisted resolver"() {
        given:
        def randomResourceId = "resourceId"
        def existingResolverJson = """{
	"name": "name",
	"resourceId": "$randomResourceId",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        def existingResolver = new ObjectMapper().readValue(existingResolverJson.bytes, FileBackedHttpMetadataResolver)
        def existingResolverVersion = existingResolver.hashCode()

        def randomName = randomGenerator.randomString(10)
        def postedJsonBody = """{
	"name": "$randomName",
	"resourceId": "$randomResourceId",
    "version": "$existingResolverVersion",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        def updatedResolver = new ObjectMapper().readValue(postedJsonBody.bytes, FileBackedHttpMetadataResolver)
        1 * repository.findByResourceId(randomResourceId) >> existingResolver
        1 * repository.save(_) >> updatedResolver

        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/FileBackedHttp')
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
        def randomResourceId = "resourceId"
        def existingResolverJson = """{
	"name": "name",
	"resourceId": "$randomResourceId",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        def existingResolver = new ObjectMapper().readValue(existingResolverJson.bytes, FileBackedHttpMetadataResolver)
        def existingResolverVersion = existingResolver.hashCode()

        def randomName = randomGenerator.randomString(10)
        def randomVersion = randomGenerator.randomInt()
        def postedJsonBody = """{
	"name": "$randomName",
	"resourceId": "$randomResourceId",
    "version": "$randomVersion",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        1 * repository.findByResourceId(randomResourceId) >> existingResolver
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/FileBackedHttp')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isConflict())
    }

    def "PUT of a resolver that is not persisted returns not found"() {
        given:
        def randomResourceId = randomGenerator.randomId()
        def postedJsonBody = """{
	"name": "name",
	"resourceId": "$randomResourceId",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef",
        "taskTimerRef": "taskTimerRef",
        "minRefreshDelay": "minRefreshDelay",
        "maxRefreshDelay": "maxRefreshDelay",
        "refreshDelayFactor": 1.0,
        "indexesRef": "indexesRef",
        "resolveViaPredicatesOnly": true,
        "expirationWarningThreshold": "expirationWarningThreshold"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}"""
        1 * repository.findByResourceId(randomResourceId) >> null
        0 * repository.save(_)

        when:
        def result = mockMvc.perform(
                put('/api/MetadataProvider/FileBackedHttp')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isNotFound())
    }
}
