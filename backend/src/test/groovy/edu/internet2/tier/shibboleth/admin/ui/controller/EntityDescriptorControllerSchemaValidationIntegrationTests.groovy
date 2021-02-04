package edu.internet2.tier.shibboleth.admin.ui.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(["no-auth", "dev"])
class EntityDescriptorControllerSchemaValidationIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    static RESOURCE_URI = '/api/EntityDescriptor'

    def 'POST /EntityDescriptor with invalid payload according to schema validation'() {
        given:
        def postedJsonBody = """            
              {	            
	            "serviceProviderName": "SP",
	            "entityId": "ED",
	            "organization": null,
	            "serviceEnabled": true,
	            "createdDate": null,
                "modifiedDate": null,
	            "organization": null,
	            "contacts": null,
	            "mdui": null,
	            "serviceProviderSsoDescriptor": null,
	            "logoutEndpoints": null,
	            "securityInfo": null,
	            "assertionConsumerServices": null,
	            "relyingPartyOverrides": null,
                "attributeRelease": null,
                "current": false
              }                
        """

        when:
        def result = this.restTemplate.postForEntity(RESOURCE_URI, createRequestHttpEntityFor { postedJsonBody }, Map)

        then:
        result.statusCodeValue == 400
        result.body.errorMessage.count('Type mistmatch for null') > 0
    }

    private static HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }
}
