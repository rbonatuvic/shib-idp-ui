package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
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
class FilterControllerTests extends Specification {

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

        controller = new FilterController (
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

    def "FilterController.getAll gets all filters"() {
        given:
        def metadataResolver = new MetadataResolver()
        metadataResolver.setMetadataFilters(testObjectGenerator.buildFilterList())
        List<MetadataResolver> metadataResolverList = [metadataResolver]
        1 * metadataResolverRepository.findAll() >> metadataResolverList

        def expectedContent = []
        metadataResolver.getMetadataFilters().each {
            expectedContent.add(filterService.createRepresentationFromFilter(it))
        }
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
        metadataResolver.setMetadataFilters(testObjectGenerator.buildFilterList())
        List<MetadataResolver> metadataResolverList = [metadataResolver]
        1 * metadataResolverRepository.findAll() >> metadataResolverList

        def expectedFilter = filterService.createRepresentationFromFilter(
                chooseRandomFilterFromList(metadataResolver.metadataFilters))
        def expectedFilterId = expectedFilter.id
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON_UTF8

        when:
        def result = mockMvc.perform(get("/api/MetadataResolver/foo/Filter/$expectedFilterId"))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(mapper.writeValueAsString(expectedFilter)))
                .andDo(MockMvcResultHandlers.print())
    }

    def "FilterController.create creates the desired filter"() {
        given:
        controller.filterService = mockFilterService // so we can control ids

        def randomFilter = testObjectGenerator.buildEntityAttributesFilter()
        def metadataResolver = new MetadataResolver()
        metadataResolver.setResourceId(randomGenerator.randomId())
        metadataResolver.setMetadataFilters(testObjectGenerator.buildFilterList())
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
        def randomFilter = testObjectGenerator.buildEntityAttributesFilter()
        def updatedFilter = testObjectGenerator.buildEntityAttributesFilter()
        updatedFilter.resourceId = randomFilter.resourceId
        def postedJsonBody = mapper.writeValueAsString(
                filterService.createRepresentationFromFilter(updatedFilter))

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId(randomGenerator.randomId())
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildFilterList())
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
        result.andExpect(status().isOk())
                .andExpect(content().json(postedJsonBody, true))
    }

    EntityAttributesFilter chooseRandomFilterFromList(List<EntityAttributesFilter> filters) {
        filters.get(randomGenerator.randomInt(0, filters.size() - 1))
    }
}
