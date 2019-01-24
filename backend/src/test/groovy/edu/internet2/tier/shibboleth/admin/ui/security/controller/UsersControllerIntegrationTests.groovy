package edu.internet2.tier.shibboleth.admin.ui.security.controller

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(["no-auth", "dev"])
class UsersControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    static RESOURCE_URI = '/api/admin/users'

    ObjectMapper mapper

    def setup() {
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)
    }

    def 'GET ALL users (when there are existing users)'() {
        when: 'GET request is made for ALL users in the system, and system has users in it'
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: 'Request completed with HTTP 200 and returned a list of users'
        result.statusCodeValue == 200
        result.body[0].username == 'admin'
        result.body[0].role == 'ROLE_ADMIN'
    }

    def 'GET ALL users by role (when there are existing users)'() {
        when:
        def result = this.restTemplate.getForEntity(RESOURCE_URI + '/role/ROLE_ADMIN', Object)

        then: 'Request completed with HTTP 200 and returned a list of users'
        result.statusCodeValue == 200
        ((Object[]) result.body).size() == 2
        result.body[0].role == 'ROLE_ADMIN'
        result.body[1].role == 'ROLE_ADMIN'
    }

    def 'GET ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = this.restTemplate.getForEntity("$RESOURCE_URI/admin", Map)

        then: 'Request completed with HTTP 200 and returned one user'
        result.statusCodeValue == 200
        result.body.username == 'admin'
        result.body.role == 'ROLE_ADMIN'
    }

    def 'GET ONE NON-existing user'() {
        when: 'GET request is made for one NON-existing user'
        def result = this.restTemplate.getForEntity("$RESOURCE_URI/bogus", Map)

        then: 'Request completed with HTTP 404'
        result.statusCodeValue == 404
        result.body.errorCode == '404'
        result.body.errorMessage == 'User with username [bogus] not found'
    }

    @DirtiesContext
    def 'DELETE ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = this.restTemplate.getForEntity("$RESOURCE_URI/admin", Map)

        then: 'Request completed with HTTP 200'
        result.statusCodeValue == 200

        when: 'DELETE request is made'
        this.restTemplate.delete("$RESOURCE_URI/admin")
        result = this.restTemplate.getForEntity("$RESOURCE_URI/admin", Map)

        then: 'The deleted user is gone'
        result.statusCodeValue == 404
    }

    def 'POST new user persists properly'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'FooBar',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        def result = this.restTemplate.postForEntity("$RESOURCE_URI", createRequestHttpEntityFor { JsonOutput.toJson(newUser) }, Map)

        then:
        result.statusCodeValue == 200
    }

    def 'POST new duplicate username returns 409'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'DuplicateUser',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        this.restTemplate.postForEntity("$RESOURCE_URI", createRequestHttpEntityFor { JsonOutput.toJson(newUser) }, Map)
        def result = this.restTemplate.postForEntity("$RESOURCE_URI", createRequestHttpEntityFor { JsonOutput.toJson(newUser) }, Map)

        then:
        result.statusCodeValue == 409
    }

    def 'PUT updates user properly'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'FooBar',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        this.restTemplate.postForEntity("$RESOURCE_URI", createRequestHttpEntityFor { JsonOutput.toJson(newUser) }, Map)
        newUser['firstName'] = 'Bob'
        def result = this.restTemplate.exchange("$RESOURCE_URI/$newUser.username", HttpMethod.PATCH, createRequestHttpEntityFor { JsonOutput.toJson(newUser) }, Map)

        then:
        result.statusCodeValue == 200
    }

    def 'PATCH detects unknown username'() {
        given:
        def newUser = [firstName: 'Foo',
                       lastName: 'Bar',
                       username: 'UnknownUser',
                       password: 'somepass',
                       emailAddress: 'foo@institution.edu',
                       role: 'ROLE_USER']

        when:
        def result = this.restTemplate.exchange("$RESOURCE_URI/$newUser.username", HttpMethod.PATCH, createRequestHttpEntityFor { mapper.writeValueAsString(newUser) }, Map)

        then:
        result.statusCodeValue == 404
    }

    private HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }
}