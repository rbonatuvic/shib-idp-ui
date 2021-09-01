package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Primary
import org.springframework.context.annotation.Profile
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate
import spock.lang.Specification
import spock.lang.Stepwise
import spock.lang.Subject

import javax.persistence.EntityManager

import static org.springframework.http.MediaType.APPLICATION_JSON
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * Test to recreate an issue discovered while trying to validate fixes for other bugs - SHIBUI-2033
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration, LocalConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles(["edoi-test"])
@Stepwise
class EntityDescriptorOwnershipIntegrationTests extends Specification {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager
    
    @Autowired
    EntityService entityService
    
    @Autowired
    GroupServiceForTesting groupService
    
    @Autowired
    OwnershipRepository ownershipRepository
    
    @Autowired
    RoleRepository roleRepository

    @Autowired
    JPAEntityDescriptorServiceImpl service
        
    @Autowired
    UserRepository userRepository
    
    @Autowired
    UserService userService

    def mockRestTemplate = Mock(RestTemplate)

    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    Group cuGroup = new Group().with {
        it.name = "College Users"
        it.resourceId = "cu-group"
        it
    }

    def mockMvc

    @Subject
    def controller

    @Transactional
    def setup() {
        groupService.clearAllForTesting()

        EntityDescriptorVersionService versionService = Mock()
        controller = new EntityDescriptorController(versionService)
        controller.openSamlObjects = openSamlObjects
        controller.entityDescriptorService = service
        controller.restTemplate = mockRestTemplate

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build()

        if (roleRepository.count() == 0) {
            def roles = [new Role().with {
                name = 'ROLE_ADMIN'
                it
            }, new Role().with {
                name = 'ROLE_USER'
                it
            }, new Role().with {
                name = 'ROLE_ENABLE'
                it
            }]
            roles.each {
                roleRepository.save(it)
            }
        }
        
        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN")
        User adminUser = new User(username: "admin", roles: [adminRole.get()], password: "foo")
        userService.save(adminUser)
        
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
        User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        userService.save(user)
        
        EntityDescriptorConversionUtils.setOpenSamlObjects(openSamlObjects)
        EntityDescriptorConversionUtils.setEntityService(entityService)
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def "The test scenario"() {
        when:"step 1 - create new group"
        cuGroup = groupService.createGroup(cuGroup)

        then:
        groupService.findAll().size() == 3

        when: "step 2 - assign the user to new group"
        User user = userRepository.findByUsername("someUser").get()
        user.setGroup(cuGroup)
        def updatedUser = userService.save(user)

        then:
        updatedUser.getGroupId() == "cu-group"
        ownershipRepository.findAllByOwner(cuGroup).size() == 1

        when: "step 3 - create a new ED and then change its ownership to the cu group"
        def expectedEntityId = 'https://shib'
        def expectedSpName = 'sp1'

        def postedJsonBody = """            
              {
	            "serviceProviderName": "$expectedSpName",
	            "entityId": "$expectedEntityId",
	            "organization": {},
	            "serviceEnabled": false,
                "current": false
              }                
        """
        def result = mockMvc.perform(post('/api/EntityDescriptor').contentType(APPLICATION_JSON).content(postedJsonBody))

        then:
        result.andExpect(status().isCreated())
                .andExpect(jsonPath("\$.entityId").value("https://shib"))
                .andExpect(jsonPath("\$.serviceEnabled").value(false))
                .andExpect(jsonPath("\$.idOfOwner").value("admingroup"))

        ownershipRepository.findAllByOwner(cuGroup).size() == 1 // someUser
        ownershipRepository.findAllByOwner(Group.ADMIN_GROUP).size() == 2 // admin user + entity descriptor

        when: "step 4 - change ownership of the ED"
        String contentAsString = result.andReturn().getResponse().getContentAsString()
        def mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
        mapper.registerModule(new JavaTimeModule())
        EntityDescriptorRepresentation edRep = mapper.readValue(contentAsString, EntityDescriptorRepresentation.class)
        edRep.setIdOfOwner(cuGroup.getOwnerId())
        service.update(edRep)

        then:
        ownershipRepository.findAllByOwner(cuGroup).size() == 2 // someUser + entity descriptor
        ownershipRepository.findAllByOwner(Group.ADMIN_GROUP).size() == 1 // admin user
    }

    @org.springframework.boot.test.context.TestConfiguration
    @Profile(value = "edoi-test")
    static class LocalConfig {
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