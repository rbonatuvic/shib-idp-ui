package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.BaseDataJpaTestSetup
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.*
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.w3c.dom.Document
import spock.lang.Unroll

import static org.hamcrest.CoreMatchers.containsString
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@ContextConfiguration(classes=[MFCLocalConfig])
class MetadataFiltersControllerTests extends BaseDataJpaTestSetup {

    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @Autowired
    FilterService filterService

    TestObjectGenerator testObjectGenerator
    RandomGenerator randomGenerator
    ObjectMapper mapper

    def metadataResolverRepository = Mock(MetadataResolverRepository)

    def metadataFilterRepository = Mock(FilterRepository)

    def controller

    def mockMvc

    static BASE_URI = '/api/MetadataResolvers'

    @Transactional
    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        controller = new MetadataFiltersController (
                repository: metadataResolverRepository,
                filterRepository: metadataFilterRepository,
                groupService: groupService,
                userService: userService,
                metadataResolverService: new MetadataResolverService() {
                    @Override
                    void reloadFilters(String metadataResolverName) {
                        // we do nothing 'cause we're lazy
                    }

                    @Override
                    Document generateConfiguration() {
                        return null
                    }
                },
                chainingMetadataResolver: new OpenSamlChainingMetadataResolver().with {
                    it.id = 'chain'
                    it.resolvers = []
                    it.initialize()
                    it
                }
        )
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()
    }

    @WithMockAdmin
    def "FilterController.getAll gets all available types of filters"() {
        given:
        def metadataResolver = new MetadataResolver()
        List<MetadataFilter> expectedContent = testObjectGenerator.buildAllTypesOfFilterList()
        metadataResolver.setMetadataFilters(expectedContent)
        1 * metadataResolverRepository.findByResourceId(_) >> metadataResolver

        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON

        when:
        def result = mockMvc.perform(get("$BASE_URI/foo/Filters"))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(mapper.writeValueAsString(expectedContent)))
    }

    @WithMockAdmin
    def "FilterController.getOne gets the desired filter"() {
        given:
        def metadataResolver = new MetadataResolver()
        def expectedFilter = testObjectGenerator.entityAttributesFilter()
        metadataResolver.metadataFilters = [expectedFilter]
        1 * metadataResolverRepository.findByResourceId(_) >> metadataResolver
        1 * metadataFilterRepository.findByResourceId(_) >> expectedFilter

        def expectedResourceId = expectedFilter.resourceId
        def expectedHttpResponseStatus = status().isOk()
        def expectedResponseContentType = APPLICATION_JSON

        when:
        def result = mockMvc.perform(get("$BASE_URI/foo/Filters/$expectedResourceId"))

        then:
        result.andExpect(expectedHttpResponseStatus)
                .andExpect(content().contentType(expectedResponseContentType))
                .andExpect(content().json(mapper.writeValueAsString(expectedFilter)))
    }

    @Unroll
    @WithMockAdmin
    def "FilterController.create creates the desired filter (filterType: #filterType)"(String filterType) {
        given:
        def randomFilter = testObjectGenerator.buildRandomFilterOfType(filterType)
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
        def expectedResponseHeaderValue = "$BASE_URI/$expectedMetadataResolverUUID/Filters/$expectedFilterUUID"
        def expectedJsonBody = mapper.writeValueAsString(randomFilter)
        def postedJsonBody = expectedJsonBody - ~/"id":.*?,/ // remove the "id:<foo>,"

        when:
        def result = mockMvc.perform(post("$BASE_URI/foo/Filters")
                                        .contentType(APPLICATION_JSON)
                                        .content(postedJsonBody))

        then:
        println postedJsonBody
        result.andExpect(status().isCreated())
                .andExpect(content().json(expectedJsonBody, true))
                .andExpect(header().string(expectedResponseHeader, containsString(expectedResponseHeaderValue)))

        where:
        filterType            | _
        'entityAttributes'    | _
        'entityRoleWhiteList' | _
        'signatureValidation' | _
        'requiredValidUntil'  | _
        'nameIdFormat'        | _
    }

    @Unroll
    @WithMockAdmin
    def "FilterController.update updates the target #filterType filter as desired"(String filterType) {
        given:
        def originalFilter = testObjectGenerator.buildRandomFilterOfType(filterType)
        def updatedFilter = testObjectGenerator.copyOf(originalFilter)
        updatedFilter.name = 'Updated Filter'
        updatedFilter.version = originalFilter.hashCode()
        def updatedFilterJson = mapper.writeValueAsString(updatedFilter)

        def originalMetadataResolver = new MetadataResolver()
        originalMetadataResolver.setResourceId('foo')
        originalMetadataResolver.setMetadataFilters(testObjectGenerator.buildAllTypesOfFilterList())
        originalMetadataResolver.metadataFilters.add(originalFilter)

        def updatedMetadataResolver = new MetadataResolver()
        updatedMetadataResolver.setResourceId(originalMetadataResolver.getResourceId())
        updatedMetadataResolver.setMetadataFilters(originalMetadataResolver.getMetadataFilters().collect())
        updatedMetadataResolver.getMetadataFilters().add(updatedFilter)

        1 * metadataResolverRepository.findByResourceId(_) >> originalMetadataResolver
        1 * metadataFilterRepository.save(_) >> updatedFilter

        def filterUUID = updatedFilter.getResourceId()

        when:
        def result = mockMvc.perform(put("$BASE_URI/foo/Filters/$filterUUID")
                            .contentType(APPLICATION_JSON).content(updatedFilterJson))

        then:
        def expectedJson = new JsonSlurper().parseText(updatedFilterJson)
        expectedJson << [version: updatedFilter.getVersion()]
        result.andExpect(status().isOk())
                .andExpect(content().json(JsonOutput.toJson(expectedJson), true))

        where:
        filterType            | _
        'entityAttributes'    | _
        'entityRoleWhiteList' | _
        'signatureValidation' | _
        'requiredValidUntil'  | _
        'nameIdFormat'        | _
    }

    @WithMockAdmin
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
                put("$BASE_URI/foo/Filters/$filterUUID")
                        .contentType(APPLICATION_JSON)
                        .content(postedJsonBody))

        then:
        result.andExpect(status().is(409))
    }

    @TestConfiguration
    private static class MFCLocalConfig {
        @Bean
        JPAFilterTargetServiceImpl jpaFilterTargetService() {
            return new JPAFilterTargetServiceImpl()
        }

        @Bean
        JPAEntityServiceImpl jpaEntityService(OpenSamlObjects openSamlObjects, AttributeUtility attributeUtility,
                                              CustomPropertiesConfiguration customPropertiesConfiguration) {
            return new JPAEntityServiceImpl(openSamlObjects, attributeUtility,customPropertiesConfiguration)
        }

        @Bean
        JPAFilterServiceImpl jpaFilterService(EntityDescriptorService entityDescriptorService, EntityService entityService,
                                              FilterTargetService filterTargetService) {
            return new JPAFilterServiceImpl().with {
                it.entityDescriptorService = entityDescriptorService
                it.entityService = entityService
                it.filterTargetService = filterTargetService
                it
            }
        }

        @Bean
        ModelRepresentationConversions modelRepresentationConversions(CustomPropertiesConfiguration customPropertiesConfiguration) {
            return new ModelRepresentationConversions(customPropertiesConfiguration)
        }
    }
}