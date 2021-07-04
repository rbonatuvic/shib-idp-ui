package edu.internet2.tier.shibboleth.admin.ui.security.controller


import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.transaction.annotation.Transactional

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException
import spock.lang.Ignore
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

import javax.persistence.EntityManager

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(["no-auth", "dev"])
@Transactional
class GroupsControllerIntegrationTests extends Specification {
    @Autowired
    private MockMvc mockMvc

    @Autowired
    EntityManager entityManager
    
    static RESOURCE_URI = '/api/admin/groups'
    static USERS_RESOURCE_URI = '/api/admin/users'
    
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
        def result = mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newGroup))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isCreated())
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(content().json(expectedJson, false))
              
        when: 'Try to create with an existing resource id'
        def exceptionExpected = mockMvc.perform(post(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON).content(JsonOutput.toJson(newGroup))
                                       .accept(MediaType.APPLICATION_JSON)).andReturn().getResolvedException()
        
        then: 'Expecting method not allowed'
        exceptionExpected instanceof GroupExistsConflictException == true
    }

    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'PUT (update) existing group persists properly'() {
        given:
        def group = [name: 'NOT AAA',
                        description: 'updated AAA',
                        resourceId: 'AAA']

        def expectedJson = """
  {
    "name":"NOT AAA",
    "description":"updated AAA",
    "resourceId":"AAA"
  }
"""
        when:
        def result = mockMvc.perform(put(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(group))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
              .andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(content().json(expectedJson, false))
              
        when: 'Try to update with a non-existing resource id'
        def newGroup = [name: 'XXXXX',
            description: 'should not work',
            resourceId: 'XXXX']
        def exceptionExpected = mockMvc.perform(put(RESOURCE_URI).contentType(MediaType.APPLICATION_JSON).content(JsonOutput.toJson(newGroup))
                                    .accept(MediaType.APPLICATION_JSON)).andReturn().getResolvedException()

        then: 'Expecting nothing happened because the object was not found'
        exceptionExpected instanceof EntityNotFoundException == true
    }
        
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET checks for groups (when there are existing groups)'() {
        when: 'GET request is made for ALL groups in the system, and system has groups in it'
        def result = mockMvc.perform(get(RESOURCE_URI))

        then: 'Request completed with HTTP 200 and returned a list of groups'
        result.andExpect(status().isOk())
                
        when: 'GET request for a single specific group in a system that has groups'
        def singleGroupRequest = mockMvc.perform(get("$RESOURCE_URI/BBB"))
        
        then: 'GET request for a single specific group completed with HTTP 200'
        singleGroupRequest.andExpect(status().isOk())
        
        when: 'GET request for a single non-existent group in a system that has groups'
        def exceptionExpected = mockMvc.perform(get("$RESOURCE_URI/CCC")).andReturn().getResolvedException()
        
        then: 'The group not found'
        exceptionExpected instanceof EntityNotFoundException == true
    }
      
    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'DELETE performs correctly when group attached to a user'() {
        given:
        def group = [resourceId: 'AAA']
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'FooBar',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER',
                       group: group]
        
        when:
        def result = mockMvc.perform(post(USERS_RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))
        
        then:
        result.andExpect(status().isOk())
       
        when:
        def userresult = mockMvc.perform(get("$USERS_RESOURCE_URI/$newUser.username"))
        def expectedJson = """
{
  "modifiedBy" : admin,
  "firstName" : "Foo",
  "emailAddress" : "foo@institution.edu",
  "role" : "ROLE_USER",
  "username" : "FooBar",
  "createdBy" : admin,
  "lastName" : "Bar",
  "group" : {"resourceId":"AAA"}
}"""
        then: 'Request completed with HTTP 200 and returned one user'
        userresult.andExpect(status().isOk())
                  .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                  .andExpect(content().json(expectedJson, false))
        
        
        when: 'DELETE request is made'
        entityManager.flush()
        entityManager.clear()
        
        def exceptionExpected = mockMvc.perform(delete("$RESOURCE_URI/$group.resourceId")).andReturn().getResolvedException()

        then: 'Expecting method not allowed'
        exceptionExpected instanceof GroupDeleteException == true
    }
}
