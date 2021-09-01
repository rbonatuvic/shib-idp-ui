package edu.internet2.tier.shibboleth.admin.ui.security.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.controller.support.RestControllersSupport
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.http.MediaType
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.util.NestedServletException

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@ContextConfiguration(classes=[UCILocalConfig])
@Rollback
class UsersControllerIntegrationTests extends AbstractBaseDataJpaTest {
    @Autowired
    GroupsRepository groupsRepository

    @Autowired
    ObjectMapper mapper
    
    MockMvc mockMvc
    def users
    
    static RESOURCE_URI = '/api/admin/users'
    static VALIDATION_REGEX = "^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$"
    
    def setup() {
        def controller = new UsersController(userRepository, userService)
        mockMvc = MockMvcBuilders.standaloneSetup(controller).setControllerAdvice(new RestControllersSupport()).build()
        createDevUsersAndGroups()
    }

    @Transactional
    void createDevUsersAndGroups() {
        userRepository.findAll().forEach {
            userService.delete(it.getUsername())
        }
        userRepository.flush()
        
        def groups = [
            new Group().with {
                it.name = "A1"
                it.description = "AAA Group"
                it.resourceId = "AAA"
                it.validationRegex = VALIDATION_REGEX
                it
            },
            new Group().with {
                it.name = "B1"
                it.description = "BBB Group"
                it.resourceId = "BBB"
                it.validationRegex = VALIDATION_REGEX
                it
            }]
        groups.each {
            try {
                groupsRepository.save(it)
            } catch (Throwable e) {
                // ???
            }
        }
        groupsRepository.flush()
        
        if (userRepository.count() == 0) {
            users = [new User().with {
                username = 'admin'
                password = '{noop}adminpass'
                firstName = 'Joe'
                lastName = 'Doe'
                emailAddress = 'joe@institution.edu'
                roles.add(roleRepository.findByName('ROLE_ADMIN').get())
                it
            }, new User().with {
                username = 'nonadmin'
                password = '{noop}nonadminpass'
                firstName = 'Peter'
                lastName = 'Vandelay'
                emailAddress = 'peter@institution.edu'
                roles.add(roleRepository.findByName('ROLE_USER').get())
                it
            }, new User().with {
                username = 'none'
                password = '{noop}nonepass'
                firstName = 'Bad'
                lastName = 'robot'
                emailAddress = 'badboy@institution.edu'
                roles.add(roleRepository.findByName('ROLE_NONE').get())
                it
            }, new User().with { // allow us to auto-login as an admin
                username = 'anonymousUser'
                password = '{noop}anonymous'
                firstName = 'Anon'
                lastName = 'Ymous'
                emailAddress = 'anon@institution.edu'
                roles.add(roleRepository.findByName('ROLE_ADMIN').get())
                it
            }]
            users.each {
                userService.save(it)
            }
        }
    }
    
    @WithMockAdmin
    def 'GET ALL users (when there are existing users)'() {
        // given: users created in setup

        when: 'GET request is made for ALL users in the system, and system has users in it'
        def result = mockMvc.perform(get(RESOURCE_URI))

        then: 'Request completed with HTTP 200 and returned a list of users'
        result.andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
              .andExpect(jsonPath("\$.[0].username").value("admin"))
              .andExpect(jsonPath("\$.[0].emailAddress").value("joe@institution.edu"))
              .andExpect(jsonPath("\$.[0].role").value("ROLE_ADMIN"))
              .andExpect(jsonPath("\$.[0].groupId").value("admingroup"))
              .andExpect(jsonPath("\$.[0].userGroups.[0].validationRegex").isEmpty())
              .andExpect(jsonPath("\$.[1].username").value("nonadmin"))
              .andExpect(jsonPath("\$.[1].emailAddress").value("peter@institution.edu"))
              .andExpect(jsonPath("\$.[1].role").value("ROLE_USER"))
              .andExpect(jsonPath("\$.[1].groupId").value("nonadmin"))
              .andExpect(jsonPath("\$.[1].userGroups.[0].validationRegex").value("/(?:)/"))
              .andExpect(jsonPath("\$.[2].username").value("none"))
              .andExpect(jsonPath("\$.[2].emailAddress").value("badboy@institution.edu"))
              .andExpect(jsonPath("\$.[2].role").value("ROLE_NONE"))
              .andExpect(jsonPath("\$.[2].groupId").value("none"))
              .andExpect(jsonPath("\$.[2].userGroups.[0].validationRegex").value("/(?:)/"))
              .andExpect(jsonPath("\$.[3].username").value("anonymousUser"))
              .andExpect(jsonPath("\$.[3].emailAddress").value("anon@institution.edu"))
              .andExpect(jsonPath("\$.[3].role").value("ROLE_ADMIN"))
              .andExpect(jsonPath("\$.[3].groupId").value("admingroup"))
              .andExpect(jsonPath("\$.[3].userGroups.[0].validationRegex").isEmpty())
    }

    @WithMockAdmin
    def 'GET ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/admin"))

        then: 'Request completed with HTTP 200 and returned one user'
        result
                .andExpect(status().isOk()).andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("\$.username").value("admin"))
                .andExpect(jsonPath("\$.emailAddress").value("joe@institution.edu"))
                .andExpect(jsonPath("\$.role").value("ROLE_ADMIN"))
                .andExpect(jsonPath("\$.groupId").value("admingroup"))
                .andExpect(jsonPath("\$.userGroups.[0].validationRegex").isEmpty())
    }

    @WithMockAdmin
    def 'GET ONE NON-existing user'() {
        when: 'GET request is made for one NON-existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/bogus"))

        then: 'Request completed with HTTP 404'
        result.andExpect(status().isNotFound())
    }

    @WithMockAdmin
    def 'DELETE ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = mockMvc.perform(get("$RESOURCE_URI/nonadmin"))

        then: 'Request completed with HTTP 200'
        result.andExpect(status().isOk())

        when: 'DELETE request is made'
        result = mockMvc.perform(delete("$RESOURCE_URI/nonadmin"))

        then: 'DELETE was successful'
        result.andExpect(status().isNoContent())

        // 'GET request is made for the deleted user'
        try {
            mockMvc.perform(get("$RESOURCE_URI/nonadmin"))
            false
        }
        catch (NestedServletException expectedResult) {
            expectedResult.getCause() instanceof HttpClientErrorException
        }
    }

    @WithMockAdmin
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

    @WithMockAdmin
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

    @WithMockAdmin
    def 'PATCH updates user properly'() {
        given:
        String userString = mockMvc.perform(get("$RESOURCE_URI/none")).andReturn().getResponse().getContentAsString()
        User user = mapper.readValue(userString, User.class)
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
                      .andExpect(jsonPath("\$.userGroups.[0].validationRegex").value(VALIDATION_REGEX))

        def groups = ownershipRepository.findAllGroupsForUser(user.username)
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
                         .andExpect(jsonPath("\$.userGroups.[0].validationRegex").isEmpty())

        def groupsCheck = ownershipRepository.findAllGroupsForUser(user.username)
        groupsCheck.size() == 1

    }

    @WithMockAdmin
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
    
    @TestConfiguration
    private static class UCILocalConfig {
        @Bean
        ObjectMapper objectMapper() {
            JavaTimeModule module = new JavaTimeModule()
            LocalDateTimeDeserializer localDateTimeDeserializer =  new LocalDateTimeDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSSSS"))
            module.addDeserializer(LocalDateTime.class, localDateTimeDeserializer)

            return Jackson2ObjectMapperBuilder.json().modules(module).featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).build()
        }
    }
}