package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import spock.lang.Specification

class PolymorphicResolversJacksonHandlingTests extends Specification {

    ObjectMapper mapper

    AttributeUtility attributeUtility

    TestObjectGenerator testObjectGenerator

    def setup() {
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        attributeUtility = new AttributeUtility(new OpenSamlObjects().with {
            it.init()
            it
        })
        testObjectGenerator = new TestObjectGenerator(attributeUtility)
    }

    def "Correct polymorphic serialization of LocalDynamicMetadataResolver"() {
        given:
        def givenResolverJson = """
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
        def deSerializedResolver = mapper.readValue(givenResolverJson, MetadataResolver)
        def json = mapper.writeValueAsString(deSerializedResolver)
        println(json)
        def roundTripResolver = mapper.readValue(json, MetadataResolver)


        then:
        roundTripResolver == deSerializedResolver
        deSerializedResolver instanceof LocalDynamicMetadataResolver
        deSerializedResolver.metadataFilters.size() == 2
        deSerializedResolver.metadataFilters[0] instanceof EntityAttributesFilter
        deSerializedResolver.metadataFilters[1] instanceof EntityRoleWhiteListFilter
    }

    def "Correct polymorphic serialization of DynamicHttpMetadataResolver"() {
        given:
        def givenResolverJson = """
            {
              "createdDate" : null,
              "modifiedDate" : null,
              "createdBy" : null,
              "modifiedBy" : null,
              "name" : null,
              "resourceId" : "248168e2-7ccb-424e-8480-263f3df32034",
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
                "resourceId" : "3bc95d7d-4db6-4f56-a99b-8da2163a936c",
                "filterEnabled" : false,
                "version" : -107872130,
                "entityAttributesFilterTarget" : {
                  "createdDate" : null,
                  "modifiedDate" : null,
                  "createdBy" : null,
                  "modifiedBy" : null,
                  "entityAttributesFilterTargetType" : "ENTITY",
                  "value" : [ "ohD3PFTEoJ" ],
                  "audId" : null
                },
                "attributeRelease" : [ "CsYlANiTHt" ],
                "relyingPartyOverrides" : {
                  "signAssertion" : true,
                  "dontSignResponse" : false,
                  "turnOffEncryption" : true,
                  "useSha" : true,
                  "ignoreAuthenticationMethod" : true,
                  "omitNotBefore" : true,
                  "responderId" : "310c2919-ee78-4c61-8f03-b653212cfdfb",
                  "nameIdFormats" : [ "cYAVB5imC2" ],
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
                "resourceId" : "e68c84c5-c1d9-45c9-bddc-336b55ebe3ed",
                "filterEnabled" : false,
                "version" : 0,
                "removeRolelessEntityDescriptors" : true,
                "removeEmptyEntitiesDescriptors" : true,
                "retainedRoles" : [ "role1", "role2" ],
                "audId" : null,
                "@type" : "EntityRoleWhiteList"
              } ],
              "version" : 0,
              "dynamicMetadataResolverAttributes" : {
                "parserPoolRef" : null,
                "taskTimerRef" : null,
                "refreshDelayFactor" : 0.75,
                "minCacheDuration" : "PT10M",
                "maxCacheDuration" : "PT8H",
                "maxIdleEntityData" : "PT8H",
                "removeIdleEntityData" : null,
                "cleanupTaskInterval" : "PT30M",
                "persistentCacheManagerRef" : null,
                "persistentCacheManagerDirectory" : null,
                "persistentCacheKeyGeneratorRef" : null,
                "initializeFromPersistentCacheInBackground" : true,
                "backgroundInitializationFromCacheDelay" : "PT2S",
                "initializationFromCachePredicateRef" : null
              },
              "httpMetadataResolverAttributes" : {
                "httpClientRef" : null,
                "connectionRequestTimeout" : null,
                "connectionTimeout" : null,
                "socketTimeout" : null,
                "disregardTLSCertificate" : false,
                "tlsTrustEngineRef" : null,
                "httpClientSecurityParametersRef" : null,
                "proxyHost" : null,
                "proxyPort" : null,
                "proxyUser" : null,
                "proxyPassword" : null,
                "httpCaching" : null,
                "httpCacheDirectory" : null,
                "httpMaxCacheEntries" : null,
                "httpMaxCacheEntrySize" : null
              },
              "maxConnectionsTotal" : 100,
              "maxConnectionsPerRoute" : 100,
              "supportedContentTypes" : null,
              "audId" : null,
              "@type" : "DynamicHttpMetadataResolver"
            }
        """

        when:
        def deSerializedResolver = mapper.readValue(givenResolverJson, MetadataResolver)
        def json = mapper.writeValueAsString(deSerializedResolver)
        println(json)
        def roundTripResolver = mapper.readValue(json, MetadataResolver)


        then:
        roundTripResolver == deSerializedResolver
        deSerializedResolver instanceof DynamicHttpMetadataResolver
        deSerializedResolver.metadataFilters.size() == 2
        deSerializedResolver.metadataFilters[0] instanceof EntityAttributesFilter
        deSerializedResolver.metadataFilters[1] instanceof EntityRoleWhiteListFilter
    }

    def "Correct polymorphic serialization of FileBackedHttpMetadataResolver"() {
        given:
        MetadataResolver resolver = new FileBackedHttpMetadataResolver().with {
            it.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes()
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes()
            it.metadataFilters = [testObjectGenerator.entityAttributesFilter(), testObjectGenerator.entityRoleWhitelistFilter()]
            it
        }
        def givenResolverJson = """
            {
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "name" : null,
                "resourceId" : "f3e615d5-960b-4fed-bff6-86fc4620be95",
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
                  "resourceId" : "4149cc5f-137e-4045-9369-8fedafcdd8c8",
                  "filterEnabled" : false,
                  "version" : -1249726767,
                  "entityAttributesFilterTarget" : {
                    "createdDate" : null,
                    "modifiedDate" : null,
                    "createdBy" : null,
                    "modifiedBy" : null,
                    "entityAttributesFilterTargetType" : "CONDITION_SCRIPT",
                    "value" : [ "6EksoLF7Q0" ],
                    "audId" : null
                  },
                  "attributeRelease" : [ ],
                  "relyingPartyOverrides" : {
                    "signAssertion" : false,
                    "dontSignResponse" : true,
                    "turnOffEncryption" : false,
                    "useSha" : false,
                    "ignoreAuthenticationMethod" : false,
                    "omitNotBefore" : false,
                    "responderId" : "3267361e-7d8c-45d2-92ce-7642dc3bb432",
                    "nameIdFormats" : [ "baHO7CzFHH" ],
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
                  "resourceId" : "75117ec7-c74a-45cb-b216-cbbc9118fe70",
                  "filterEnabled" : false,
                  "version" : 0,
                  "removeRolelessEntityDescriptors" : true,
                  "removeEmptyEntitiesDescriptors" : true,
                  "retainedRoles" : [ "role1", "role2" ],
                  "audId" : null,
                  "@type" : "EntityRoleWhiteList"
                } ],
                "version" : 0,
                "metadataURL" : null,
                "backingFile" : null,
                "initializeFromBackupFile" : true,
                "backupFileInitNextRefreshDelay" : null,
                "reloadableMetadataResolverAttributes" : {
                  "parserPoolRef" : null,
                  "taskTimerRef" : null,
                  "minRefreshDelay" : null,
                  "maxRefreshDelay" : null,
                  "refreshDelayFactor" : null,
                  "indexesRef" : null,
                  "resolveViaPredicatesOnly" : null,
                  "expirationWarningThreshold" : null
                },
                "httpMetadataResolverAttributes" : {
                  "httpClientRef" : null,
                  "connectionRequestTimeout" : null,
                  "connectionTimeout" : null,
                  "socketTimeout" : null,
                  "disregardTLSCertificate" : false,
                  "tlsTrustEngineRef" : null,
                  "httpClientSecurityParametersRef" : null,
                  "proxyHost" : null,
                  "proxyPort" : null,
                  "proxyUser" : null,
                  "proxyPassword" : null,
                  "httpCaching" : null,
                  "httpCacheDirectory" : null,
                  "httpMaxCacheEntries" : null,
                  "httpMaxCacheEntrySize" : null
                },
                "audId" : null,
                "@type" : "FileBackedHttpMetadataResolver"
            }               
        """

        when:
        //println mapper.writeValueAsString(resolver)
        def deSerializedResolver = mapper.readValue(givenResolverJson, MetadataResolver)
        def json = mapper.writeValueAsString(deSerializedResolver)
        println(json)
        def roundTripResolver = mapper.readValue(json, MetadataResolver)


        then:
        true
        roundTripResolver == deSerializedResolver
        deSerializedResolver instanceof FileBackedHttpMetadataResolver
        deSerializedResolver.metadataFilters.size() == 2
        deSerializedResolver.metadataFilters[0] instanceof EntityAttributesFilter
        deSerializedResolver.metadataFilters[1] instanceof EntityRoleWhiteListFilter
    }
}
