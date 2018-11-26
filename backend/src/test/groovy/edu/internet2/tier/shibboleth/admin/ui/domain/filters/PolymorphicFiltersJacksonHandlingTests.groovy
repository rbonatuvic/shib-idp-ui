package edu.internet2.tier.shibboleth.admin.ui.domain.filters

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest
class PolymorphicFiltersJacksonHandlingTests extends Specification {

    ObjectMapper mapper

    AttributeUtility attributeUtility

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    TestObjectGenerator testObjectGenerator

    def setup() {
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        attributeUtility = new AttributeUtility(new OpenSamlObjects().with {
            it.init()
            it
        })
        testObjectGenerator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
    }

    def "Correct polymorphic serialization of EntityRoleWhiteListFilter"() {
        given:
        def givenFilterJson = """
            {                                                
                "@type" : "EntityRoleWhiteList",
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "name" : "EntityRoleWhiteList",
                "resourceId" : "r1",
                "filterEnabled" : false,
                "version" : 0,
                "removeRolelessEntityDescriptors" : true,
                "removeEmptyEntitiesDescriptors" : true,
                "retainedRoles" : [ "role1", "role2" ],
                "audId" : null
            }
        """

        when:
        def deSerializedFilter = mapper.readValue(givenFilterJson, MetadataFilter)
        def json = mapper.writeValueAsString(deSerializedFilter)
        println(json)
        def roundTripFilter = mapper.readValue(json, MetadataFilter)


        then:
        roundTripFilter == deSerializedFilter

        and:
        deSerializedFilter instanceof EntityRoleWhiteListFilter
        roundTripFilter instanceof EntityRoleWhiteListFilter
    }

    def "Correct polymorphic serialization of EntityAttributesFilter"() {
        given:
        def simulatedPersistentFilter = testObjectGenerator.entityAttributesFilter()
        simulatedPersistentFilter.intoTransientRepresentation()

        def simulatedPrePersistentFilter = new EntityAttributesFilter()
        simulatedPrePersistentFilter.attributeRelease = simulatedPersistentFilter.attributeRelease
        simulatedPrePersistentFilter.relyingPartyOverrides = simulatedPersistentFilter.relyingPartyOverrides

        expect:
        simulatedPersistentFilter.attributes.size() == simulatedPrePersistentFilter.attributes.size()
    }

    def "Correct polymorphic serialization of RequiredValidUntilFilter"() {
        given:
        def givenFilterJson = """
            {
                "@type" : "RequiredValidUntil",
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "name" : null,
                "resourceId" : "9667ae04-8c36-4741-be62-dd325e7d6790",
                "filterEnabled" : true,
                "version" : 0,
                "maxValidityInterval" : "P14D"
  
            }
        """

        when:
        def deSerializedFilter = mapper.readValue(givenFilterJson, MetadataFilter)
        def json = mapper.writeValueAsString(deSerializedFilter)
        println(json)
        def roundTripFilter = mapper.readValue(json, MetadataFilter)

        then:
        roundTripFilter == deSerializedFilter

        and:
        deSerializedFilter instanceof RequiredValidUntilFilter
        roundTripFilter instanceof RequiredValidUntilFilter
    }

    def "List of filters with correct types"() {
        given:
        def filters = testObjectGenerator.buildAllTypesOfFilterList()

        when:
        def json = mapper.writeValueAsString(filters)
        println(json)

        then:
        json.contains('EntityAttributes')
        json.contains('RequiredValidUntil')
        json.contains('EntityAttributes')
        json.contains('NameIDFormat')

    }

    def "Deserialization of EntityAttributes filter"() {
        given:
        def filterJson = """
        {
            "createdDate" : null,
            "modifiedDate" : null,
            "createdBy" : null,
            "modifiedBy" : null,
            "name" : "EntityAttributes",
            "resourceId" : "ab3fec19-8544-45d8-9700-289155b42edf",
            "filterEnabled" : false,
            "version" : 0,
            "entityAttributesFilterTarget" : {
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "entityAttributesFilterTargetType" : "ENTITY",
                "value" : [ "GATCCLk32V" ],
                "audId" : null
            },
            "attributeRelease" : [ ],
            "relyingPartyOverrides" : {
                "signAssertion" : true,
                "dontSignResponse" : false,
                "turnOffEncryption" : false,
                "useSha" : false,
                "ignoreAuthenticationMethod" : true,
                "omitNotBefore" : false,
                "responderId" : null,
                "nameIdFormats" : [ "wEPdpaov4a" ],
                "authenticationMethods" : [ "FlCgvd4Z60" ]
            },
            "audId" : null,
            "@type" : "EntityAttributes"
        }"""

        when:
        def filter = mapper.readValue(filterJson, MetadataFilter)

        then:
        filter instanceof EntityAttributesFilter
        filter.resourceId == 'ab3fec19-8544-45d8-9700-289155b42edf'
        EntityAttributesFilter.class.cast(filter).entityAttributesFilterTarget.entityAttributesFilterTargetType.name() == 'ENTITY'
        EntityAttributesFilter.class.cast(filter).entityAttributesFilterTarget.value == ['GATCCLk32V']
    }

    def "Correct polymorphic serialization of NameIdFormatFilter"() {
        given:
        def givenFilterJson = """
            {
                "@type" : "NameIDFormat",
                "name" : "NameIDFormat",
                "resourceId" : "20147f53-e368-4911-921a-2e24598e37f8",
                "filterEnabled" : true,
                "removeExistingFormats" : false,
                "formats" : [ {
                  "format" : "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
                  "value" : "https://sp1.example.org",
                  "type" : "ENTITY"
                }, {
                  "format" : "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                  "value" : "https://sp2.example.org",
                  "type" : "ENTITY"
                }, {
                  "format" : "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
                  "value" : "input.getEntityID().equals(\\"https://sp1.example.org\\");",
                  "type" : "CONDITION_SCRIPT"
                } ]  
            }"""

        when:
        def deSerializedFilter = mapper.readValue(givenFilterJson, MetadataFilter)
        def json = mapper.writeValueAsString(deSerializedFilter)
        println(json)
        def roundTripFilter = mapper.readValue(json, MetadataFilter)

        then:
        roundTripFilter == deSerializedFilter

        and:
        deSerializedFilter instanceof NameIdFormatFilter
        roundTripFilter instanceof NameIdFormatFilter
    }
}
