package edu.internet2.tier.shibboleth.admin.ui.domain

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter

import spock.lang.Specification

class PolymorphicFiltersJacksonHandlingTests extends Specification {

    ObjectMapper mapper

    def setup() {
        mapper = new ObjectMapper()
        mapper.enable(SerializationFeature.INDENT_OUTPUT);
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
        def roundTripFilter = mapper.readValue(mapper.writeValueAsString(deSerializedFilter), MetadataFilter)


        then:
        roundTripFilter == deSerializedFilter

        and:
        deSerializedFilter instanceof EntityRoleWhiteListFilter
        roundTripFilter instanceof EntityRoleWhiteListFilter
    }
}
