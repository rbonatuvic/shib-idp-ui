package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConverterConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverValidationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.StringTrimModule
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.MetadataResolverValidationService
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository
import edu.internet2.tier.shibboleth.admin.ui.service.DefaultMetadataResolversPositionOrderContainerService
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryService
import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAMetadataResolverServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverConverterService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import groovy.json.JsonSlurper
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import spock.lang.Unroll

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ContextConfiguration(classes=[MetadataResolverValidationConfiguration, MetadataResolverConverterConfiguration,
                               MetadataResolverConfiguration, EntitiesVersioningConfiguration,
                               edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration,
                               PlaceholderResolverComponentsConfiguration, MRCILocalConfig])
class MetadataResolversControllerIntegrationTests extends AbstractBaseDataJpaTest {
    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    MetadataResolversController controller

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @Autowired
    ObjectMapper mapper

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    TestObjectGenerator generator
    MockMvc mockMvc

    static String BASE_URI = '/api/MetadataResolvers'

    @Transactional
    def setup() {
        generator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
        metadataResolverRepository.deleteAll()

        mockMvc = MockMvcBuilders.standaloneSetup(controller).setMessageConverters(new MappingJackson2HttpMessageConverter(mapper)).build()
    }

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    @WithMockAdmin
    def "GET empty -> /api/MetadataResolvers"() {
        when: 'No resolvers are available in data store'
        def result = mockMvc.perform(get(BASE_URI))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
                .andExpect(jsonPath("\$").isEmpty())
    }

    @WithMockAdmin
    def "GET one available MetadataResolver -> /api/MetadataResolvers"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        metadataResolverRepository.save(resolver)

        when: 'GET request is made'
        def result = mockMvc.perform(get(BASE_URI))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.[0].name").value("Test DynamicHttpMetadataResolver"))
              .andExpect(jsonPath("\$.[0].['@type']").value("DynamicHttpMetadataResolver"))

    }

    @WithMockAdmin
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
        def result = mockMvc.perform(get(BASE_URI))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.[0].name").value("Test DynamicHttpMetadataResolver"))
              .andExpect(jsonPath("\$.[0].['@type']").value("DynamicHttpMetadataResolver"))
              .andExpect(jsonPath("\$.[1].name").value("Test FileBackedHttpMetadataResolver"))
              .andExpect(jsonPath("\$.[1].['@type']").value("FileBackedHttpMetadataResolver"))
    }

    @WithMockAdmin
    def "GET concrete MetadataResolver -> /api/MetadataResolvers/{resourceId}"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'Test DynamicHttpMetadataResolver'
            it
        }
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = mockMvc.perform(get("$BASE_URI/$resolverResourceId"))

        then:
        result.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.name").value("Test DynamicHttpMetadataResolver"))
              .andExpect(jsonPath("\$.['@type']").value("DynamicHttpMetadataResolver"))

    }

    @WithMockAdmin
    def "GET non-existent MetadataResolver -> /api/MetadataResolvers/{resourceId}"() {
        when: 'GET request is made with resource Id not matching any resolvers'
        def result = mockMvc.perform(get("$BASE_URI/bogus-resource-id"))

        then:
        result.andExpect(status().isNotFound())
    }

    @WithMockAdmin
    def "SHIBUI-839 - POST resolver with spaces in the provider name results in trimmed name"() {
        given:
        def resolver = generator.buildRandomMetadataResolverOfType('DynamicHttp')
        resolver.name = '   This name has spaces    '
        def expectedName = 'This name has spaces'

        when:
        def result = mockMvc.perform(post(BASE_URI).contentType(APPLICATION_JSON).content(mapper.writeValueAsString(resolver)))

        then:
        result.andExpect(status().isCreated()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.name").value(expectedName))
    }

    @WithMockAdmin
    @Unroll
    def "POST new concrete MetadataResolver of type #resolverType -> /api/MetadataResolvers"(String resolverType) {
        given: 'New MetadataResolver JSON representation'
        def resolver = generator.buildRandomMetadataResolverOfType(resolverType)
        String sourceDirectory
        if (resolverType == 'LocalDynamic') {
            sourceDirectory = ((LocalDynamicMetadataResolver) resolver).sourceDirectory
        }

        when: 'POST request is made with new Resolver JSON representation'
        def result = mockMvc.perform(post(BASE_URI).contentType(APPLICATION_JSON).content(mapper.writeValueAsString(resolver)))

        then:
        result.andExpect(status().isCreated()).andExpect(content().contentType(APPLICATION_JSON))
              .andExpect(jsonPath("\$.['@type']").value(resolver.getType()))

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

    @WithMockAdmin
    def "SHIBUI-1992 - error creating FileBackedHTTPMetadata"() {
        def resolver = new FileBackedHttpMetadataResolver().with {
            it.name = 'FBHMR'
            it.xmlId = '1'
            it.backingFile = 'tmp/foo'
            it.metadataURL = 'https://nexus.microsoftonline-p.com/federationmetadata/saml20/federationmetadata.xml'
            it.backupFileInitNextRefreshDelay = 'PT4H'
            it.enabled = Boolean.FALSE
            it
        }

        when:
        def result = mockMvc.perform(post(BASE_URI).contentType(APPLICATION_JSON).content(mapper.writeValueAsString(resolver)))

        then:
        result.andExpect(status().isCreated())
    }

    @WithMockAdmin
    @Unroll
    def "PUT concrete MetadataResolver of type #resolverType with updated changes -> /api/MetadataResolvers/{resourceId}"(String resolverType) {
        given: 'One resolver is available in data store'
        def resolver = generator.buildRandomMetadataResolverOfType(resolverType)
        String sourceDirectory
        if (resolverType == 'Localdynamic') {
            sourceDirectory = ((LocalDynamicMetadataResolver) resolver).sourceDirectory
        }
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = mockMvc.perform(get("$BASE_URI/$resolverResourceId")).andReturn()

        and: 'Resolver data is updated and sent back to the server'
        def metadataResolverMap = new JsonSlurper().parseText(result.getResponse().getContentAsString())

        metadataResolverMap.name = 'Updated Resolver Name'
        def updatedResult = mockMvc.perform(put("$BASE_URI/${metadataResolverMap.resourceId}").contentType(APPLICATION_JSON).content(mapper.writeValueAsString(metadataResolverMap)))

        then:
        updatedResult.andExpect(status().isOk()).andExpect(content().contentType(APPLICATION_JSON))
                     .andExpect(jsonPath("\$.name").value('Updated Resolver Name'))

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

    @WithMockAdmin
    def "PUT concrete MetadataResolver with version conflict -> /api/MetadataResolvers/{resourceId}"() {
        given: 'One resolver is available in data store'
        def resolver = new DynamicHttpMetadataResolver().with {
            it.name = 'DynamicHTTP'
            it.xmlId = 'DynamicHTTP'
            it.metadataRequestURLConstructionScheme = new MetadataQueryProtocolScheme().with {
                it.transformRef = 'transformRef'
                it.content = 'content'
                it
            }
            it
        }
        def resolverResourceId = resolver.resourceId
        def persistedResolver = metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        MvcResult result = mockMvc.perform(get("$BASE_URI/$resolverResourceId")).andReturn()

        and: 'Resolver data is updated and sent back to the server, but then original resolver is changed in data store'
        persistedResolver.name = 'Some other name'
        metadataResolverRepository.save(persistedResolver)

        def metadataResolverMap = mapper.readValue(result.getResponse().getContentAsString(), DynamicHttpMetadataResolver.class)
        metadataResolverMap.name = 'Updated DynamicHttpMetadataResolver'
        def updatedResult = mockMvc.perform(put("$BASE_URI/${metadataResolverMap.resourceId}").contentType(APPLICATION_JSON).content(mapper.writeValueAsString(metadataResolverMap)))

        then:
        updatedResult.andExpect(status().isConflict())
    }

    @WithMockAdmin
    def "POST new MetadataResolver with one EntityAttributesFilters attached -> /api/MetadataResolvers"() {
        given: 'New MetadataResolver with attached entity attributes filter JSON representation'
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters << generator.entityAttributesFilter()

        when: 'POST request is made with new FileBackedMetadataResolver with EntityAttributesFilter JSON representation'
        def result = mockMvc.perform(post(BASE_URI).contentType(APPLICATION_JSON).content(mapper.writeValueAsString(resolver)))

        then:
        def location = result.andExpect(status().isCreated()).andReturn().getResponse().getHeaderValue("Location")

        location.contains(BASE_URI)

        when: 'Query REST API for newly created resolver'
        def createdResolverResult = mockMvc.perform(get(location)).andReturn().getResponse().getContentAsString()
        def createdResolver = mapper.readValue(createdResolverResult, edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver)

        then:
        createdResolver.metadataFilters.size() == 1
        createdResolver.metadataFilters[0] instanceof EntityAttributesFilter
    }

    @WithMockAdmin
    @Transactional
    def "PUT MetadataResolver with one EntityAttributesFilters attached and check version -> /api/MetadataResolvers"() {
        given: 'MetadataResolver with attached entity attributes is available in data store'
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters << generator.entityAttributesFilter()
        def resolverResourceId = resolver.resourceId
        metadataResolverRepository.save(resolver)

        when: 'GET request is made with resource Id matching the existing resolver'
        def result = mockMvc.perform(get("$BASE_URI/$resolverResourceId")).andReturn().getResponse().getContentAsString()
        def existingMetadataResolverMap = new JsonSlurper().parseText(result)

        and: 'PUT call is made with'
        existingMetadataResolverMap.name = 'Updated'
        def updatedResultFromPUT = mockMvc.perform(put("$BASE_URI/${existingMetadataResolverMap.resourceId}")
                                                  .contentType(APPLICATION_JSON).content(mapper.writeValueAsString(existingMetadataResolverMap)))
                                                  .andReturn().getResponse().getContentAsString()
        def updatedResultFromGET = mockMvc.perform(get("$BASE_URI/$existingMetadataResolverMap.resourceId")).andReturn().getResponse().getContentAsString()

        then:
        updatedResultFromPUT == updatedResultFromGET
    }

    @TestConfiguration
    private static class MRCILocalConfig {
        @Bean
        DirectoryService directoryService() {
            return new DirectoryServiceImpl()
        }

        @Bean
        MetadataResolversController metadataResolversController(MetadataResolverRepository metadataResolverRepository, MetadataResolverValidationService metadataResolverValidationService,
                                                                MetadataResolverService metadataResolverService, MetadataResolversPositionOrderContainerService positionOrderContainerService,
                                                                IndexWriterService indexWriterService, MetadataResolver chainingMetadataResolver,
                                                                MetadataResolverConverterService metadataResolverConverterService, MetadataResolverVersionService versionService) {
            MetadataResolversController mrc = new MetadataResolversController().with {
                it.resolverRepository = metadataResolverRepository
                it.metadataResolverValidationService = metadataResolverValidationService
                it.metadataResolverService = metadataResolverService
                it.positionOrderContainerService = positionOrderContainerService
                it.indexWriterService = indexWriterService
                it.chainingMetadataResolver = chainingMetadataResolver
                it.metadataResolverConverterService = metadataResolverConverterService
                it.versionService = versionService
                it
            }
            return mrc
        }

        @Bean
        MetadataResolversPositionOrderContainerService metadataResolversPositionOrderContainerService(MetadataResolversPositionOrderContainerRepository positionOrderContainerRepository,
                                                                                                      MetadataResolverRepository resolverRepository) {
            return new DefaultMetadataResolversPositionOrderContainerService(positionOrderContainerRepository, resolverRepository)
        }
    }
}