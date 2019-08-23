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
class MetadataResolverControllerSchemaValidationIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    static RESOURCE_URI = '/api/MetadataResolvers'

    private HTTP_POST = { body ->
        this.restTemplate.postForEntity(RESOURCE_URI, createRequestHttpEntityFor(body), Map)
    }

    private static checkJsonValidationIsPerformed = {
        assert it.statusCodeValue == 400
        assert it.body.errorMessage.count('Type mistmatch for null') > 0
        true
    }

    def 'POST for LocalDynamicMetadataResolver with invalid payload according to schema validation'() {
        given:
        def postedJsonBody = """            
            {
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "name" : null,
                "requireValidMetadata" : true,
                "failFastInitialization" : true,
                "sortKey" : null,
                "criterionPredicateRegistryRef" : null,
                "useDefaultPredicateRegistry" : true,
                "satisfyAnyPredicates" : false,
                "metadataFilters" : [ {
                    "createdDate" : null,
                    "modifiedDate" : null,
                    "createdBy" : null,
                    "modifiedBy" : null,
                    "name" : "EntityAttributes",    
                    "filterEnabled" : false,
                    "version" : 463855403,
                    "entityAttributesFilterTarget" : {
                        "createdDate" : null,
                        "modifiedDate" : null,
                        "createdBy" : null,
                        "modifiedBy" : null,
                        "entityAttributesFilterTargetType" : "ENTITY",
                        "value" : [ "CedewbJJET" ],
                        "audId" : null
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
                    "audId" : null,
                    "@type" : "EntityAttributes"
                }, {
                    "createdDate" : null,
                    "modifiedDate" : null,
                    "createdBy" : null,
                    "modifiedBy" : null,
                    "name" : "EntityRoleWhiteList",    
                    "filterEnabled" : false,
                    "version" : 0,
                    "removeRolelessEntityDescriptors" : true,
                    "removeEmptyEntitiesDescriptors" : true,
                    "retainedRoles" : [ "role1", "role2" ],
                    "audId" : null,
                    "@type" : "EntityRoleWhiteList"
                } ],
                "version" : 0,
                "sourceDirectory" : "dir",
                "sourceManagerRef" : null,
                "sourceKeyGeneratorRef" : null,  
                "audId" : null,
                "@type" : "LocalDynamicMetadataResolver"
            }                
        """

        when:
        def result = HTTP_POST(postedJsonBody)

        then:
        checkJsonValidationIsPerformed(result)

    }

    def 'POST for DynamicHttpMetadataResolver with invalid payload according to schema validation'() {
        given:
        def postedJsonBody = """            
            {
                "name" : null,
                "xmlId": "123",
                "metadataURL": "http://metadata",                
                "metadataRequestURLConstructionScheme": {"@type": "MetadataQueryProtocol", "content": "scheme"},                                                                
                "@type" : "DynamicHttpMetadataResolver"
            }                
        """

        when:
        def result = HTTP_POST(postedJsonBody)

        then:
        checkJsonValidationIsPerformed(result)

    }

    private static HttpEntity<String> createRequestHttpEntityFor(String jsonBody) {
        new HttpEntity<String>(jsonBody, ['Content-Type': 'application/json'] as HttpHeaders)
    }


}
