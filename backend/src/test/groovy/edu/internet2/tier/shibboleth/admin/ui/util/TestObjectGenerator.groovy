package edu.internet2.tier.shibboleth.admin.ui.util

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class TestObjectGenerator {

    AttributeUtility attributeUtility

    RandomGenerator generator = new RandomGenerator()

    TestObjectGenerator(AttributeUtility attributeUtility) {
        this.attributeUtility = attributeUtility
    }

    List<EntityAttributesFilter> buildFilterList() {
        List<EntityAttributesFilter> filterList = new ArrayList<>()
        (1..generator.randomInt(4, 10)).each {
            filterList.add(buildEntityAttributesFilter())
        }
        return filterList
    }

    EntityAttributesFilter buildEntityAttributesFilter() {
        EntityAttributesFilter filter = new EntityAttributesFilter()

        filter.setName(generator.randomString(10))
        filter.setFilterEnabled(generator.randomBoolean())
        filter.setResourceId(generator.randomId())
        filter.setEntityAttributesFilterTarget(buildEntityAttributesFilterTarget())
        filter.setAttributes(buildAttributesList())

        return filter
    }

    List<Attribute> buildAttributesList() {
        List<Attribute> attributes = new ArrayList<>()

        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_ASSERTIONS, MDDCConstants.SIGN_ASSERTIONS_FN, true))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.SIGN_RESPONSES, MDDCConstants.SIGN_RESPONSES_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.ENCRYPT_ASSERTIONS, MDDCConstants.ENCRYPT_ASSERTIONS_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.SECURITY_CONFIGURATION, MDDCConstants.SECURITY_CONFIGURATION_FN, "shibboleth.SecurityConfiguration.SHA1"))
        }
        if (generator.randomBoolean()) {
            // this is actually going to be wrong, but it will work for the time being. this should be a bitmask value that we calculate
            // TODO: fix
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DISALLOWED_FEATURES, MDDCConstants.DISALLOWED_FEATURES_FN, "0x1"))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithBooleanValue(MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE, MDDCConstants.INCLUDE_CONDITIONS_NOT_BEFORE_FN, false))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.RESPONDER_ID, MDDCConstants.RESPONDER_ID_FN, generator.randomId()))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.NAME_ID_FORMAT_PRECEDENCE, MDDCConstants.NAME_ID_FORMAT_PRECEDENCE_FN, generator.randomStringList()))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithArbitraryValues(MDDCConstants.DEFAULT_AUTHENTICATION_METHODS, MDDCConstants.DEFAULT_AUTHENTICATION_METHODS_FN, generator.randomStringList()))
        }
        if (generator.randomBoolean()) {
            attributes.add(attributeUtility.createAttributeWithStringValues(MDDCConstants.RELEASE_ATTRIBUTES, generator.randomStringList()))
        }

        return attributes
    }

    FilterRepresentation buildFilterRepresentation() {
        FilterRepresentation representation = new FilterRepresentation()

        representation.setFilterName(generator.randomString(10))
        representation.setAttributeRelease(generator.randomStringList())
        representation.setFilterEnabled(generator.randomBoolean())
        representation.setFilterTarget(buildFilterTargetRepresentation())
        representation.setRelyingPartyOverrides(buildRelyingPartyOverridesRepresentation())

        return representation
    }

    RelyingPartyOverridesRepresentation buildRelyingPartyOverridesRepresentation() {
        RelyingPartyOverridesRepresentation representation = new RelyingPartyOverridesRepresentation()

        representation.setAuthenticationMethods(generator.randomStringList())
        representation.setDontSignResponse(generator.randomBoolean())
        representation.setIgnoreAuthenticationMethod(generator.randomBoolean())
        representation.setNameIdFormats(generator.randomStringList())
        representation.setOmitNotBefore(generator.randomBoolean())
        representation.setSignAssertion(generator.randomBoolean())
        representation.setTurnOffEncryption(generator.randomBoolean())
        representation.setUseSha(generator.randomBoolean())
        representation.setResponderId(generator.randomId())

        return representation
    }

    EntityAttributesFilterTarget buildEntityAttributesFilterTarget() {
        EntityAttributesFilterTarget entityAttributesFilterTarget = new EntityAttributesFilterTarget()

        entityAttributesFilterTarget.setValue(generator.randomStringList())
        entityAttributesFilterTarget.setEntityAttributesFilterTargetType(randomFilterTargetType())

        return entityAttributesFilterTarget
    }

    FilterTargetRepresentation buildFilterTargetRepresentation() {
        FilterTargetRepresentation representation = new FilterTargetRepresentation()

        representation.setValue(generator.randomStringList())
        representation.setType(randomFilterTargetType().toString())

        return representation
    }

    EntityAttributesFilterTarget.EntityAttributesFilterTargetType randomFilterTargetType() {
        EntityAttributesFilterTarget.EntityAttributesFilterTargetType.values()[generator.randomInt(0, 2)]
    }
}
