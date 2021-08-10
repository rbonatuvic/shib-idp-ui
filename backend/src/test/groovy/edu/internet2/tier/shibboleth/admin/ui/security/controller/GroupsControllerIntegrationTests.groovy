package edu.internet2.tier.shibboleth.admin.ui.security.controller

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

import javax.persistence.EntityManager

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import groovy.json.JsonOutput
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, TestConfiguration, InternationalizationConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext
class GroupsControllerIntegrationTests extends Specification {
    @Autowired
    EntityManager entityManager

    @Autowired
    GroupsRepository groupsRepository
            
    @Autowired
    GroupServiceImpl groupService
    
    @Autowired
    RoleRepository roleRepository
    
    @Autowired
    UserRepository userRepository
    
    @Autowired
    UserService userService
    
    static RESOURCE_URI = '/api/admin/groups'

    def MockMvc mockMvc
        
    def setup() {
        groupService.ensureAdminGroupExists()
        
        def GroupController groupController = new GroupController().with ({  
            it.groupService = this.groupService
            it
        })
        mockMvc = MockMvcBuilders.standaloneSetup(groupController).build();
        
        if (roleRepository.count() == 0) {
            def roles = [new Role().with {
                name = 'ROLE_ADMIN'
                it
            }, new Role().with {
                name = 'ROLE_USER'
                it
            }, new Role().with {
                name = 'ROLE_NONE'
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
        user = userService.save(user)
        entityManager.flush()
    }
    
    
    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'POST new group persists properly'() {
        given:
        def newGroup = [name: 'Foo',
                        description: 'Bar',
                        resourceId: 'FooBar']

        def expectedJson = """
  {
    "name":"Foo",
    "description":"Bar",
    "resourceId":"FooBar"
  }
"""
        when:
        def result = mockMvc.perform(post(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON)
                            .content(JsonOutput.toJson(newGroup)).accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isCreated())
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(content().json(expectedJson, false))
           

       //'Try to create with an existing resource id'
        try {
            mockMvc.perform(post(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON)
                                              .content(JsonOutput.toJson(newGroup))
                                              .accept(MediaType.APPLICATION_JSON))
            1 == 2
        } catch (Throwable expected) {
            expected instanceof GroupExistsConflictException
        }
    }

    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'PUT (update) existing group persists properly'() {
        given:
        groupsRepository.deleteByResourceId("AAA")
        def Group groupAAA = new Group().with({
            it.name = "AAA"
            it.description = "AAA"
            it.resourceId = "AAA"
            it
        }) 
        groupAAA = groupsRepository.save(groupAAA)
        groupAAA.setDescription("Updated AAA")
        groupAAA.setName("NOT AAA")
        
        when:
        def result = mockMvc.perform(put(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON)
                            .content(JsonOutput.toJson(groupAAA)).accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(jsonPath("\$.name").value("NOT AAA"))
              .andExpect(jsonPath("\$.resourceId").value("AAA"))
              .andExpect(jsonPath("\$.description").value("Updated AAA"))
              
        when: 'Try to update with a non-existing resource id'
        def newGroup = [name: 'XXXXX',
            description: 'should not work',
            resourceId: 'XXXX']
        
        then:
        try {
            mockMvc.perform(put(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON)
                                             .content(JsonOutput.toJson(newGroup))
                                             .accept(MediaType.APPLICATION_JSON))
            1 == 2
        } catch (Throwable expected) {
            expected instanceof EntityNotFoundException
        }
    }

    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET checks for groups (when there are existing groups)'() {
        given:
        groupsRepository.deleteByResourceId("AAA")
        groupsRepository.deleteByResourceId("BBB")
        def Group groupAAA = new Group().with({
            it.name = "AAA"
            it.description = "AAA"
            it.resourceId = "AAA"
            it
        }) 
        groupsRepository.save(groupAAA)
        def Group groupBBB = new Group().with({
            it.name = "BBB"
            it.description = "BBB"
            it.resourceId = "BBB"
            it
        }) 
        groupsRepository.save(groupBBB)
        
        when: 'GET request is made for ALL groups in the system, and system has groups in it'
        def result = mockMvc.perform(get(RESOURCE_URI))

        then: 'Request completed with HTTP 200 and returned a list of groups'
        result.andExpect(status().isOk())
                
        when: 'GET request for a single specific group in a system that has groups'
        def singleGroupRequest = mockMvc.perform(get("$RESOURCE_URI/BBB"))
        
        then: 'GET request for a single specific group completed with HTTP 200'
        singleGroupRequest.andExpect(status().isOk())
        
        // 'GET request for a single non-existent group in a system that has groups'
        try {
            mockMvc.perform(get("$RESOURCE_URI/CCC"))
            1 == 2
        } catch (Throwable expected) {
            expected instanceof EntityNotFoundException
        }        
    }
      
    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'DELETE performs correctly when group attached to a user'() {
        // When the user is created in the setup method above, a new group "someUser" is created to be associated with that user
        // User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        // userService.save(user)
        
        when: 'try to delete group that is attached to a user'
        def nothingtodo
        
        then:
        try {
            mockMvc.perform(delete("$RESOURCE_URI/someUser"))
            1 == 2
        } catch(Throwable expected) {
            expected instanceof GroupDeleteException
        }
        
        when:
        def Group groupAAA = new Group().with({
            it.name = "AAA"
            it.description = "AAA"
            it.resourceId = "AAA"
            it
        })
        groupAAA = groupsRepository.save(groupAAA)
        
        def User user = userRepository.findByUsername("someUser").get()
        user.setGroup(groupAAA)
        userService.save(user)
        
        then:
        mockMvc.perform(delete("$RESOURCE_URI/someUser"))
    }
}
