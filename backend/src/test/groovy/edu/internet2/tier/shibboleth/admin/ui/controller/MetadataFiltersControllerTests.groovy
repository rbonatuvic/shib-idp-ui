package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
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
                filterService: filterService,
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
        List<MetadataResolver> metadataResolverList = [metadataResolver]
        1 * metadataResolverRepository.findAll() >> metadataResolverList

        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(get('/api/MetadataResolver/foo/Filters'))
        println(mapper.writeValueAsString(expectedContent))

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
        1 * metadataResolverRepository.findAll() >> [metadataResolver]

        def expectedResourceId = expectedFilter.resourceId
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(get("/api/MetadataResolver/foo/Filter/$expectedResourceId"))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(mapper.writeValueAsString(expectedFilter)))
                .andDo(MockMvcResultHandlers.print())
    }

    def "FilterController.create creates the desired filter"() {
        given:
        controller.filterService = mockFilterService // so we can control ids

        def randomFilter = testObjectGenerator.entityAttributesFilter()
        def metadataResolver = new MetadataResolver()
        metadataResolver.setResourceId(randomGenerator.randomId())
        metadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        def metadataResolverWithFilter = new MetadataResolver()
        metadataResolverWithFilter.resourceId = metadataResolver.resourceId
        metadataResolverWithFilter.metadataFilters = metadataResolver.metadataFilters.collect()
        metadataResolverWithFilter.getMetadataFilters().add(randomFilter)

        1 * metadataResolverRepository.findAll() >> [metadataResolver]
        1 * metadataResolverRepository.save(_) >> metadataResolverWithFilter
        1 * mockFilterService.createFilterFromRepresentation(_) >> randomFilter // this is where we want to control the id
        1 * mockFilterService.createRepresentationFromFilter(randomFilter) >> filterService.createRepresentationFromFilter(randomFilter)

        def expectedMetadataResolverUUID = metadataResolver.getResourceId()
        def expectedFilterUUID = randomFilter.getResourceId()
        def expectedResponseHeader = 'Location'
        def expectedResponseHeaderValue = "/api/MetadataResolver/$expectedMetadataResolverUUID/Filter/$expectedFilterUUID"
        def expectedJsonBody = mapper.writeValueAsString(filterService.createRepresentationFromFilter(randomFilter))
        def postedJsonBody = expectedJsonBody - ~/"id":.*?,/ // remove the "id:<foo>,"

        when:
        def result = mockMvc.perform(
                post('/api/MetadataResolver/foo/Filter')
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
                .andExpect(content().json(expectedJsonBody, true))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))
    }

    def "FilterController.update updates the target filter as desired"() {
        given:
        def randomFilter = testObjectGenerator.entityAttributesFilter()
        def updatedFilter = testObjectGenerator.entityAttributesFilter()
        updatedFilter.resourceId = randomFilter.resourceId
        def updatedFilterRepresentation = filterService.createRepresentationFromFilter(updatedFilter)
        updatedFilterRepresentation.setVersion(randomFilter.hashCode())
        def postedJsonBody = mapper.writeValueAsString(updatedFilterRepresentation)

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId(randomGenerator.randomId())
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        def updatedMetadataResolver = new MetadataResolver()
        updatedMetadataResolver.setResourceId(originalMetadataResolver.getResourceId())
        updatedMetadataResolver.setMetadataFilters(originalMetadataResolver.getMetadataFilters().collect())
        originalMetadataResolver.getMetadataFilters().add(randomFilter)
        updatedMetadataResolver.getMetadataFilters().add(updatedFilter)

        1 * metadataResolverRepository.findAll() >> [originalMetadataResolver]
        1 * metadataResolverRepository.save(_) >> updatedMetadataResolver

        def filterUUID = randomFilter.getResourceId()

        when:
        def result = mockMvc.perform(
                put("/api/MetadataResolver/foo/Filter/$filterUUID")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        def expectedJson = new JsonSlurper().parseText(postedJsonBody)
        expectedJson << [version: updatedFilter.hashCode()]
        result.andExpect(status().isOk())
                .andExpect(content().json(JsonOutput.toJson(expectedJson), true))
    }

    def "FilterController.update 409's if the version numbers don't match"() {
        given:
        def randomFilter = testObjectGenerator.entityAttributesFilter()
        def updatedFilter = testObjectGenerator.entityAttributesFilter()
        updatedFilter.resourceId = randomFilter.resourceId
        def postedJsonBody = mapper.writeValueAsString(
                filterService.createRepresentationFromFilter(updatedFilter))

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId(randomGenerator.randomId())
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        originalMetadataResolver.getMetadataFilters().add(randomFilter)

        1 * metadataResolverRepository.findAll() >> [originalMetadataResolver]

        def filterUUID = randomFilter.getResourceId()

        when:
        def result = mockMvc.perform(
                put("/api/MetadataResolver/foo/Filter/$filterUUID")
                        .contentType(APPLICATION_JSON_UTF8)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().is(409))
    }

    EntityAttributesFilter chooseRandomFilterFromList(List<MetadataFilter> filters) {
        filters.get(randomGenerator.randomInt(0, filters.size() - 1))
    }
}
