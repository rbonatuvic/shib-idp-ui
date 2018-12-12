package edu.internet2.tier.shibboleth.admin.ui.security.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
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

    static RESOURCE_URI = '/api/security/users'

    def "GET users"() {
        when: 'GET request is made for ALL users in the system'
        def result = this.restTemplate.getForEntity(RESOURCE_URI, Object)

        then: "Request completed successfully"
        result.statusCodeValue == 200
        result.body[0].username == 'admin'
        result.body[0].roles[0].name == 'ROLE_ADMIN'
    }
}