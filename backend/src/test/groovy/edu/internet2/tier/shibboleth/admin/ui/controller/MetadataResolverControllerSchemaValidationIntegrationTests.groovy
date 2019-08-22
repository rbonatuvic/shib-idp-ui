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
        def result = this.restTemplate.postForEntity(RESOURCE_URI, createRequestHttpEntityFor { postedJsonBody }, Map)

        then:
        result.statusCodeValue == 400
        result.body.errorMessage.count('Type mistmatch for null') > 0
    }

    private static HttpEntity<String> createRequestHttpEntityFor(Closure jsonBodySupplier) {
        new HttpEntity<String>(jsonBodySupplier(), ['Content-Type': 'application/json'] as HttpHeaders)
    }
}
