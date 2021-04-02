package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import spock.lang.Shared
import spock.lang.Specification

class VersioningTests extends Specification{
    @Shared
    OpenSamlObjects openSamlObjects

    def setup() {
        this.openSamlObjects = new OpenSamlObjects()
        this.openSamlObjects.init()
    }

    def "test that two loaded entity descriptors gets the same version when load from the same file"() {
        given:
        def xmlBytes = this.class.getResource('/metadata/SHIBUI-1723-1.xml').bytes
        def ed1 = openSamlObjects.unmarshalFromXml(xmlBytes)
        def ed2 = openSamlObjects.unmarshalFromXml(xmlBytes)

        expect:
        ed1.hashCode() == ed2.hashCode()
    }
}
