package edu.internet2.tier.shibboleth.admin.ui.security.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer

import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import spock.lang.Ignore
import spock.lang.Specification
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.model.UserGroup
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserGroupRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles(["no-auth", "dev"])
@DirtiesContext
class UsersControllerIntegrationTests extends Specification {
    @Autowired
    IGroupService groupService
    
    @Autowired 
    UserGroupRepository ugRepo
    
    @Autowired
    private MockMvc mockMvc

    static RESOURCE_URI = '/api/admin/users'
    
    def ObjectMapper mapper
    
    def setup() {
        JavaTimeModule module = new JavaTimeModule();
        LocalDateTimeDeserializer localDateTimeDeserializer =  new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"));
        module.addDeserializer(LocalDateTime.class, localDateTimeDeserializer);
        mapper = Jackson2ObjectMapperBuilder.json()
                                            .modules(module)
                                            .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                                            .build()
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ALL users (when there are existing users)'() {
        given:
        // The list of users created by the "dev" configuration
        def expectedJson = """
[
  {
    "modifiedBy" : "anonymousUser",
    "firstName" : "Joe",
    "emailAddress" : "joe@institution.edu",
    "role" : "ROLE_ADMIN",
    "username" : "admin",
    "createdBy" : anonymousUser,
    "lastName" : "Doe"
  },
  {
    "modifiedBy" : "anonymousUser",
    "firstName" : "Peter",
    "emailAddress" : "peter@institution.edu",
    "role" : "ROLE_USER",
    "username" : "nonadmin",
    "createdBy" : anonymousUser,
    "lastName" : "Vandelay"
  },
  {
    "modifiedBy" : "anonymousUser",
    "firstName" : "Bad",
    "emailAddress" : "badboy@institution.edu",
    "role" : "ROLE_NONE",
    "username" : "none",
    "createdBy" : "anonymousUser",
    "lastName" : "robot"
  },
  {
    "modifiedBy" : "anonymousUser",
    "firstName" : "Anon",
    "emailAddress" : "anon@institution.edu",
    "role" : "ROLE_ADMIN",
    "username" : "anonymousUser",
    "createdBy" : "anonymousUser",
    "lastName" : "Ymous"
  }
]"""
        when: 'GET request is made for ALL users in the system, and system has users in it'
        def result = mockMvc.perform(get(RESOURCE_URI))


        then: 'Request completed with HTTP 200 and returned a list of users'
        result
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expectedJson, false))
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ONE existing user'() {
        given:
        def expectedJson = """
{
  "modifiedBy" : anonymousUser,
  "firstName" : "Joe",
  "emailAddress" : "joe@institution.edu",
  "role" : "ROLE_ADMIN",
  "username" : "admin",
  "createdBy" : anonymousUser,
  "lastName" : "Doe"
}"""
        when: 'GET request is made for one existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/admin"))

        then: 'Request completed with HTTP 200 and returned one user'
        result
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(content().json(expectedJson, false))
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'GET ONE NON-existing user'() {
        when: 'GET request is made for one NON-existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/bogus"))

        then: 'Request completed with HTTP 404'
        result.andExpect(status().isNotFound())
    }

    @Rollback
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

    @Rollback
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
    }

    @Rollback
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))
        def result = mockMvc.perform(post(RESOURCE_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newUser))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isConflict())
    }

    @Rollback
    @WithMockUser(value = "admin", roles = ["ADMIN"])
    def 'PATCH updates user properly'() {
        given:
        def String userString = mockMvc.perform(get("$RESOURCE_URI/none")).andReturn().getResponse().getContentAsString()
        def User user = mapper.readValue(userString, User.class);
        user.setFirstName("somethingnew")
        
        when:
        def result = mockMvc.perform(patch("$RESOURCE_URI/$user.username")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(user))
                .accept(MediaType.APPLICATION_JSON))

        then:
        result.andExpect(status().isOk())
        
        when:
        user.setGroupId("AAA")
        def resultNewGroup = mockMvc.perform(patch("$RESOURCE_URI/$user.username").contentType(MediaType.APPLICATION_JSON)
                                    .content(mapper.writeValueAsString(user)).accept(MediaType.APPLICATION_JSON))
        
        then:
        resultNewGroup.andExpect(status().isOk())
                      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                      .andExpect(jsonPath("\$.groupId").value("AAA"))
                      
        def List<UserGroup> groups = ugRepo.findAllByUser(user)
        groups.size() == 1
        
        when: 'Updating user role to admin puts the user in the admin group'
        user.setRole("ROLE_ADMIN")
        user.setGroupId("AAA") // Dont care that this is different, ROLE_ADMIN should take precedence
        def resultUserNewRole = mockMvc.perform(patch("$RESOURCE_URI/$user.username").contentType(MediaType.APPLICATION_JSON)
            .content(mapper.writeValueAsString(user)).accept(MediaType.APPLICATION_JSON))
        
        then:
        resultUserNewRole.andExpect(status().isOk())
                      .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                      .andExpect(jsonPath("\$.groupId").value("admingroup"))
                      
        def groupsCheck = ugRepo.findAllByUser(user)
        groupsCheck.size() == 1
         
    }

    @WithMockUser(value = "admin", roles = ["ADMIN"])
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(JsonOutput.toJson(newUser)))

        then:
        result.andExpect(status().isNotFound())
    }
}
