package edu.internet2.tier.shibboleth.admin.ui.security.controller


import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import spock.lang.Ignore
import spock.lang.Specification

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(["no-auth", "dev"])
class UsersControllerIntegrationTests extends Specification {

    @Autowired
    private MockMvc mockMvc

    static RESOURCE_URI = '/api/admin/users'

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ALL users (when there are existing users)'() {
        given:
        def expectedJson = """
[
  {
    "modifiedBy" : null,
    "firstName" : "Joe",
    "emailAddress" : "joe@institution.edu",
    "role" : "ROLE_ADMIN",
    "username" : "admin",
    "createdBy" : null,
    "lastName" : "Doe"
  },
  {
    "modifiedBy" : null,
    "firstName" : "Peter",
    "emailAddress" : "peter@institution.edu",
    "role" : "ROLE_USER",
    "username" : "user",
    "createdBy" : null,
    "lastName" : "Vandelay"
  },
  {
    "modifiedBy" : null,
    "firstName" : "Bad",
    "emailAddress" : "badboy@institution.edu",
    "role" : "ROLE_NONE",
    "username" : "none",
    "createdBy" : null,
    "lastName" : "robot"
  },
  {
    "modifiedBy" : null,
    "firstName" : "Anon",
    "emailAddress" : "anon@institution.edu",
    "role" : "ROLE_ADMIN",
    "username" : "anonymousUser",
    "createdBy" : null,
    "lastName" : "Ymous"
  }
]"""
        when: 'GET request is made for ALL users in the system, and system has users in it'
        def result = mockMvc.perform(get(RESOURCE_URI))


        then: 'Request completed with HTTP 200 and returned a list of users'
        result
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(expectedJson, false))

    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ONE existing user'() {
        given:
        def expectedJson = """
{
  "modifiedBy" : null,
  "firstName" : "Joe",
  "emailAddress" : "joe@institution.edu",
  "role" : "ROLE_ADMIN",
  "username" : "admin",
  "createdBy" : null,
  "lastName" : "Doe"
}"""
        when: 'GET request is made for one existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/admin"))

        then: 'Request completed with HTTP 200 and returned one user'
        result
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(content().json(expectedJson, false))
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ONE NON-existing user'() {
        when: 'GET request is made for one NON-existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/bogus"))

        then: 'Request completed with HTTP 404'
        result.andExpect(status().isNotFound())
    }

    //TODO: These are broken due to a bug in Spring Boot. Unignore these after we update to spring boot 2.0.8+.
    @Ignore
    @DirtiesContext
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'DELETE ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/nonadmin"))

        then: 'Request completed with HTTP 200'
        result.andExpect(status().isOk())

        when: 'DELETE request is made'
        result = mockMvc.perform(delete("$RESOURCE_URI/nonadmin"))

        then: 'DELETE was successful'
        result.andExpect(status().isNoContent())

        when: 'GET request is made for the deleted user'
        result = mockMvc.perform(get("$RESOURCE_URI/nonadmin"))

        then: 'The deleted user is gone'
        result.andExpect(status().isNotFound())
    }

    @Ignore
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'POST new user persists properly'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'FooBar',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        def result = mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
    }

    @Ignore
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'POST new duplicate username returns 409'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'DuplicateUser',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))
        def result = mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isConflict())
    }

    @Ignore
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'PATCH updates user properly'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'FooBar',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        def result = mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())

        when:
        newUser['firstName'] = 'Bob'
        result = mockMvc.perform(patch("$RESOURCE_URI/$newUser.username")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
    }

    @Ignore
    def 'PATCH detects unknown username'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'UnknownUser',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        def result = mockMvc.perform(patch("$RESOURCE_URI/$newUser.username")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(JsonOutput.toJson(newUser)))

        then:
        result.andExpect(status().isNotFound())
    }
}