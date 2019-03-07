package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

class AuxiliaryJPAEntityServiceTests extends Specification {
    @Shared
    JPAEntityServiceImpl jpaEntityService

    def setup() {
        def openSamlObjects = new OpenSamlObjects().with {
            it.init()
            it
        }

        def attributeUtility = new AttributeUtility(openSamlObjects)

        jpaEntityService = new JPAEntityServiceImpl(openSamlObjects, attributeUtility)
    }

    @Unroll
    def "test invert #input"() {
        setup:
        RelyingPartyOverrideProperty overrideProperty = new RelyingPartyOverrideProperty(
                attributeName: 'name',
                attributeFriendlyName: 'friendlyName',
                displayType: 'boolean',
                invert: 'true'
        )
        Attribute att = ModelRepresentationConversions.getAttributeFromObjectAndRelyingPartyOverrideProperty(input, overrideProperty)

        expect:
        assert att && att.getAttributeValues()[0] instanceof XSBoolean && ((XSBoolean) att.getAttributeValues()[0]).value.value == output

        where:
        input | output
        true  | false
    }
}
