package edu.internet2.tier.shibboleth.admin.ui.security.controller

import edu.internet2.tier.shibboleth.admin.ui.BaseDataJpaTestSetup
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

class GroupsControllerIntegrationTests extends BaseDataJpaTestSetup {
    @Autowired
    GroupsRepository groupsRepository

    static RESOURCE_URI = '/api/admin/groups'

    MockMvc mockMvc

    @Transactional
    def setup() {
        GroupController groupController = new GroupController().with ({
            it.groupService = this.groupService
            it
        })
        mockMvc = MockMvcBuilders.standaloneSetup(groupController).build()

        if (userRepository.findByUsername("someUser").isEmpty()) {
            Optional<Role> userRole = roleRepository.findByName("ROLE_USER")
            User user = new User(username: "someUser", roles: [userRole.get()], password: "foo")
            userService.save(user)
        }
    }
    
    @WithMockAdmin
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
            false
        } catch (Throwable expected) {
            expected instanceof GroupExistsConflictException
        }
    }

    @WithMockAdmin
    def 'PUT (update) existing group persists properly'() {
        given:
        groupsRepository.deleteByResourceId("AAA")
        Group groupAAA = new Group().with({
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
            false
        } catch (Throwable expected) {
            expected instanceof EntityNotFoundException
        }
    }

    @WithMockAdmin
    def 'GET checks for groups (when there are existing groups)'() {
        given:
        groupsRepository.deleteByResourceId("AAA")
        groupsRepository.deleteByResourceId("BBB")
        Group groupAAA = new Group().with({
            it.name = "AAA"
            it.description = "AAA"
            it.resourceId = "AAA"
            it
        }) 
        groupsRepository.save(groupAAA)
        Group groupBBB = new Group().with({
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
            false
        } catch (Throwable expected) {
            expected instanceof EntityNotFoundException
        }        
    }
      
    @WithMockAdmin
    def 'DELETE performs correctly when group attached to a user'() {
        // When the user is created in the setup method above, a new group "someUser" is created to be associated with that user
        // User user = new User(username: "someUser", roles:[userRole.get()], password: "foo")
        // userService.save(user)

        expect:
        try {
            mockMvc.perform(delete("$RESOURCE_URI/someUser"))
            false
        } catch(Throwable expected) {
            expected instanceof GroupDeleteException
        }
        
        when:
        Group groupAAA = new Group().with({
            it.name = "AAA"
            it.description = "AAA"
            it.resourceId = "AAA"
            it
        })
        groupAAA = groupsRepository.save(groupAAA)
        
        User user = userRepository.findByUsername("someUser").get()
        user.setGroup(groupAAA)
        userService.save(user)
        
        then:
        mockMvc.perform(delete("$RESOURCE_URI/someUser"))
    }
}