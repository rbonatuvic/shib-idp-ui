package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import org.xmlunit.diff.Diff
import spock.lang.Specification

class BuilderTests extends Specification {
    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def "simple builder test"() {
        when:
        def expected = '''<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1" />'''
        def output = openSamlObjects.marshalToXmlString(openSamlObjects.buildDefaultInstanceOfType(org.opensaml.saml.saml2.metadata.EntityDescriptor).with {
                entityID = 'http://test.example.org/test1'
                it
            }
        )

        Diff diff = DiffBuilder.compare(Input.fromString(expected)).withTest(Input.fromString(output)).ignoreComments().ignoreWhitespace().build()

        then:
        !diff.hasDifferences()
    }
}
