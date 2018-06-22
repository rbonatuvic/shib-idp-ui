package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService
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
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.w3c.dom.Document
import spock.lang.Specification
import spock.lang.Unroll

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataFiltersControllerTests extends Specification {

    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    FilterService filterService

    TestObjectGenerator testObjectGenerator
    RandomGenerator randomGenerator
    ObjectMapper mapper

    def metadataResolverRepository = Mock(MetadataResolverRepository)

    def controller

    def mockMvc

    def mockFilterService = Mock(FilterService)

    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility)
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        controller = new MetadataFiltersController (
                repository: metadataResolverRepository,
                metadataResolverService: new MetadataResolverService() {
                    @Override
                    void reloadFilters(String metadataResolverName) {
                        // we do nothing 'cause we're lazy
                    }

                    @Override
                    Document generateConfiguration() {
                        return null
                    }
                }
        )

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    def "FilterController.getAll gets all available types of filters"() {
        given:
        def metadataResolver = new MetadataResolver()
        List<MetadataFilter> expectedContent = testObjectGenerator.buildAllTypesOfFilterList()
        metadataResolver.setMetadataFilters(expectedContent)
        1 * metadataResolverRepository.findByResourceId(_) >> metadataResolver

        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(get('/api/MetadataResolver/foo/Filters'))

        then:
        result.andExpect(expectedHttpResponseStatus)
            .andExpect(content().contentType(expectedResponseContentType))
            .andExpect(content().json(mapper.writeValueAsString(expectedContent)))
    }

    def "FilterController.getOne gets the desired filter"() {
        given:
        def metadataResolver = new MetadataResolver()
        def expectedFilter = testObjectGenerator.entityAttributesFilter()
        metadataResolver.metadataFilters = [expectedFilter]
        1 * metadataResolverRepository.findByResourceId(_) >> metadataResolver

        def expectedResourceId = expectedFilter.resourceId
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(get("/api/MetadataResolver/foo/Filters/$expectedResourceId"))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(mapper.writeValueAsString(expectedFilter)))
    }

    @Unroll
    def "FilterController.create creates the desired filter (filterType: #filterType)"(String filterType) {
        given:
        def randomFilter = testObjectGenerator.buildRandomFilterOfType(filterType)
        println('WOO! ' + randomFilter.class)
        def metadataResolver = new MetadataResolver()
        metadataResolver.setResourceId(randomGenerator.randomId())
        metadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        def metadataResolverWithFilter = new MetadataResolver()
        metadataResolverWithFilter.resourceId = metadataResolver.resourceId
        metadataResolverWithFilter.metadataFilters = metadataResolver.metadataFilters.collect()
        metadataResolverWithFilter.getMetadataFilters().add(randomFilter)

        1 * metadataResolverRepository.findByResourceId(_) >> metadataResolver
        1 * metadataResolverRepository.save(_) >> metadataResolverWithFilter

        def expectedMetadataResolverUUID = metadataResolver.getResourceId()
        def expectedFilterUUID = randomFilter.getResourceId()
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/MetadataResolver/$expectedMetadataResolverUUID/Filters/$expectedFilterUUID"
        def expectedJsonBody = mapper.writeValueAsString(randomFilter)
        def postedJsonBody = expectedJsonBody - ~/"id":.*?,/ // remove the "id:<foo>,"

        when:
        def result = mockMvc.perform(
                post('/api/MetadataResolver/foo/Filters')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
                .andExpect(content().json(expectedJsonBody, true))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))

        where:
            filterType            | _
            'entityAttributes'    | _
            'entityRoleWhiteList' | _
            'signatureValidation' | _
    }

    @Unroll
    def "FilterController.update updates the target #filterType filter as desired"(String filterType) {
        given:
        def originalFilter = testObjectGenerator.buildRandomFilterOfType(filterType)
        def updatedFilter = testObjectGenerator.copyOf(originalFilter)
        updatedFilter.name = 'Updated Filter'
        def postedJsonBody = mapper.writeValueAsString(updatedFilter)

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId(randomGenerator.randomId())
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        originalMetadataResolver.metadataFilters.add(originalFilter)

        def updatedMetadataResolver = new MetadataResolver()
        updatedMetadataResolver.setResourceId(originalMetadataResolver.getResourceId())
        updatedMetadataResolver.setMetadataFilters(originalMetadataResolver.getMetadataFilters().collect())
        updatedMetadataResolver.getMetadataFilters().add(updatedFilter)

        1 * metadataResolverRepository.findByResourceId(_) >> originalMetadataResolver
        1 * metadataResolverRepository.save(_) >> updatedMetadataResolver

        def filterUUID = updatedFilter.getResourceId()

        when:
        def result = mockMvc.perform(
                put("/api/MetadataResolver/foo/Filters/$filterUUID")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        def expectedJson = new JsonSlurper().parseText(postedJsonBody)
        updatedFilter.fromTransientRepresentation()
        expectedJson << [version: updatedFilter.hashCode()]
        result.andExpect(status().isOk())
                .andExpect(content().json(JsonOutput.toJson(expectedJson), true))

        where:
            filterType            | _
            'entityAttributes'    | _
            'entityRoleWhiteList' | _
            'signatureValidation' | _
    }

    def "FilterController.update filter 409's if the version numbers don't match"() {
        given:
        def randomFilter = testObjectGenerator.entityAttributesFilter()
        def updatedFilter = testObjectGenerator.entityAttributesFilter()
        updatedFilter.resourceId = randomFilter.resourceId
        def postedJsonBody = mapper.writeValueAsString(updatedFilter)

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId(randomGenerator.randomId())
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        originalMetadataResolver.getMetadataFilters().add(randomFilter)

        1 * metadataResolverRepository.findByResourceId(_) >> originalMetadataResolver

        def filterUUID = randomFilter.getResourceId()

        when:
        def result = mockMvc.perform(
                put("/api/MetadataResolver/foo/Filters/$filterUUID")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().is(409))
    }
}
