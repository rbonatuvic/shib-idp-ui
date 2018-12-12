package edu.internet2.tier.shibboleth.admin.ui.security.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
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

    def 'GET ALL users (when there are existing users)'() {
        when: 'GET request is made for ALL users in the system, and system has users in it'
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: 'Request completed with HTTP 200 and returned a list of users'
        result.statusCodeValue == 200
        result.body[0].username == 'admin'
        result.body[0].roles[0].name == 'ROLE_ADMIN'
    }

    def 'GET ONE existing user'() {
        when: 'GET request is made for one existing user'
        def result = this.restTemplate.getForEntity("$RESOURCE_URI/admin", Map)

        then: 'Request completed with HTTP 200 and returned one user'
        result.statusCodeValue == 200
        result.body.username == 'admin'
        result.body.roles[0].name == 'ROLE_ADMIN'
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
}