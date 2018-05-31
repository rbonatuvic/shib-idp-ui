package edu.internet2.tier.shibboleth.admin.ui.domain

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import spock.lang.Specification

class PolymorphicFiltersJacksonHandlingTests extends Specification {

    ObjectMapper mapper

    AttributeUtility attributeUtility

    TestObjectGenerator testObjectGenerator

    def setup() {
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT)

        attributeUtility = new AttributeUtility().with {
            it.openSamlObjects = new OpenSamlObjects().with {
                it.init()
                it
            }
            it
        }

        testObjectGenerator = new TestObjectGenerator(attributeUtility)
    }

    def "Correct polymorphic serialization of EntityRoleWhiteListFilter"() {
        given:
        def givenFilterJson = """
            {
                "type" : "EntityRoleWhiteList",
                "createdDate" : null,
                "modifiedDate" : null,
                "createdBy" : null,
                "modifiedBy" : null,
                "name" : "EntityRoleWhiteListFilter",
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
        def filter = testObjectGenerator.buildEntityAttributesFilter()

        filter.intoTransientRepresentation()

        when:
        def json = mapper.writeValueAsString(filter)
        println(json)

        then:
        json

    }
}
