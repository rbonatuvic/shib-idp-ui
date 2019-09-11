package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(["no-auth", "dev"])
class MetadataFiltersControllerSchemaValidationIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    static RESOURCE_URI = '/api/MetadataResolvers/%s/Filters'

    private HTTP_POST = { body, resourceId ->
        this.restTemplate.postForEntity(resourceUriFor(RESOURCE_URI, resourceId), createRequestHttpEntityFor(body), Map)
    }

    private static checkJsonValidationIsPerformed = {
        assert it.statusCodeValue == 400
        assert it.body.errorMessage.count('Type mistmatch for null') > 0
        assert it.body.errorMessage.count('Type mistmatch for "not-a-boolean"') > 0
        true
    }

    def 'POST for EntityAttributesFilter with invalid payload according to schema validation'() {
        given:
        def resolver = metadataResolverRepository.save(new FileBackedHttpMetadataResolver(name: 'fbmr', backingFile: '/tmp/metadata.xml'))
        def postedJsonBody = """            
            {                    
                    "name" : "EntityAttributes",    
                    "filterEnabled" : "not-a-boolean",                    
                    "entityAttributesFilterTarget" : {                        
                        "entityAttributesFilterTargetType" : "ENTITY",
                        "value" : [ "CedewbJJET" ]                        
                    },
                    "attributeRelease" : [ "9ktPyjjiCn" ],
                    "relyingPartyOverrides" : {
                        "signAssertion" : false,
                        "dontSignResponse" : true,
                        "turnOffEncryption" : true,
                        "useSha" : false,
                        "ignoreAuthenticationMethod" : false,
                        "omitNotBefore" : true,
                        "responderId" : null,
                        "nameIdFormats" : [ ],
                        "authenticationMethods" : [ ]
                    },                    
                    "@type" : "EntityAttributes"
            }                
        """

        when:
        def result = HTTP_POST(postedJsonBody, resolver.resourceId)

        then:
        checkJsonValidationIsPerformed(result)

    }

    private static HttpEntity<String> createRequestHttpEntityFor(String jsonBody) {
        new HttpEntity<String>(jsonBody, ['Content-Type': 'application/json'] as HttpHeaders)
    }

    private static resourceUriFor(String uriTemplate, String resourceId) {
        String.format(uriTemplate, resourceId)
    }
}
