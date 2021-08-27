package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.configuration.*
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.MetadataResolverValidationService
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.*
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import groovy.json.JsonSlurper
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.MvcResult
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import spock.lang.Specification
import spock.lang.Unroll

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL
import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, MetadataResolverValidationConfiguration, EntitiesVersioningConfiguration,
                               SearchConfiguration, edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration,
                               PlaceholderResolverComponentsConfiguration, InternationalizationConfiguration, LocalConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles("no-auth")
@DirtiesContext
class MetadataResolversControllerIntegrationTests extends Specification {
    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @Autowired
    GroupServiceForTesting groupService

    @Autowired
    MetadataResolversController controller

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    RoleRepository roleRepository

    @Autowired
    UserService userService

    ObjectMapper mapper
    TestObjectGenerator generator

    MockMvc mockMvc

    static String BASE_URI = '/api/MetadataResolvers'

    @Transactional
    def setup() {
        generator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.setSerializationInclusion(NON_NULL)
        mapper.registerModule(new JavaTimeModule())
        mapper.registerModule(new StringTrimModule())
        metadataResolverRepository.deleteAll()

        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
        User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
        userService.save(adminUser)

        groupService.clearAllForTesting()
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
              .andExpect(jsonPath("\$.name").value(resolverType))

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
    static class LocalConfig {
        @Bean
        MetadataResolver metadataResolver() {
            new OpenSamlChainingMetadataResolver()
        }

        @Bean
        MetadataResolverConverterService metadataResolverConverterServiceImpl(IndexWriterService indexWriterService, OpenSamlObjects openSamlObjects) {
            MetadataResolverConverterService result = new MetadataResolverConverterServiceImpl().with({
                it.indexWriterService = indexWriterService
                it.openSamlObjects = openSamlObjects
                it
            })
            return result
        }

        @Bean
        JPAMetadataResolverServiceImpl jpaMetadataResolverService(MetadataResolver metadataResolver, MetadataResolverRepository metadataResolverRepository,
                                                                  OpenSamlObjects openSamlObjects, MetadataResolversPositionOrderContainerService resolversPositionOrderContainerService,
                                                                  ShibUIConfiguration shibUIConfiguration){
            return new JPAMetadataResolverServiceImpl().with {
                it.metadataResolver = metadataResolver
                it.metadataResolverRepository = metadataResolverRepository
                it.openSamlObjects = openSamlObjects
                it.resolversPositionOrderContainerService = resolversPositionOrderContainerService
                it.shibUIConfiguration = shibUIConfiguration
                it
            }
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
        @Primary
        GroupServiceForTesting groupServiceForTesting(GroupsRepository repo, OwnershipRepository ownershipRepository) {
            GroupServiceForTesting result = new GroupServiceForTesting(new GroupServiceImpl().with {
                it.groupRepository = repo
                it.ownershipRepository = ownershipRepository
                return it
            })
            result.ensureAdminGroupExists()
            return result
        }
    }
}