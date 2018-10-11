package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import spock.lang.Specification

class Pac4jTest extends Specification {
    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def "test unmarshalling pac4j created metadata"() {
        when:
        def metadata = openSamlObjects.unmarshalFromXml this.class.getResourceAsStream('/metadata/SHIBUI-808.xml').bytes

        then:
        noExceptionThrown()
    }
}
