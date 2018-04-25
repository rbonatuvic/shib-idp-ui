package edu.internet2.tier.shibboleth.admin.ui.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.reactive.server.WebTestClient
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
// TODO: implement
// @SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
// @ActiveProfiles("no-auth")
class EntitiesControllerIntegrationTests extends Specification {

    @Autowired
    private WebTestClient webClient

    def "GET /api/entities returns the proper json"() {
        given:
        def expectedBody = '''
            {
                "id":null,
                "serviceProviderName":null,
                "entityId":"http://test.scaldingspoon.org/test1",
                "organization":null,
                "contacts":null,
                "mdui":null,
                "serviceProviderSsoDescriptor": {
                    "protocolSupportEnum":"SAML 2",
                    "nameIdFormats":["urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified"]
                },
                "logoutEndpoints":null,
                "securityInfo":null,
                "assertionConsumerServices":[
                    {"locationUrl":"https://test.scaldingspoon.org/test1/acs","binding":"urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST","makeDefault":false}
                ],
                "serviceEnabled":false,
                "createdDate":null,
                "modifiedDate":null,
                "relyingPartyOverrides":{
                    "signAssertion":false,
                    "dontSignResponse":false,
                    "turnOffEncryption":false,
                    "useSha":false,
                    "ignoreAuthenticationMethod":false,
                    "omitNotBefore":false,
                    "responderId":null,
                    "nameIdFormats":[],
                    "authenticationMethods":[]
                },
                "attributeRelease":["givenName","employeeNumber"]
            }
        '''

        when:
        def x = 1
        // TODO: implement
        /*
        def result = this.webClient
                .get()
                .uri("/api/entities/http%3A%2F%2Ftest.scaldingspoon.org%2Ftest1")
                .exchange()
         */

        then:
        assert 1
        // TODO: implement
        /*
        result.expectStatus().isOk()
                .expectBody().consumeWith(
                    { response -> new String(response.getResponseBody()) == expectedBody }
                )
                //.expectedBody() // some other json comparison
                */
    }
}
