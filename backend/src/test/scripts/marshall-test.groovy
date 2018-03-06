import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.ExtensionsBuilder
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptorBuilder
import org.opensaml.core.xml.schema.XSString

println "start"

def openSAMLObjects = new OpenSamlObjects().with {
    it.init()
    return it
}

def ed = new EntityDescriptorBuilder().buildObject().with {
    id = 1
    entityID = "testme"
    roleDescriptors.add SPSSODescriptorBuilder.newInstance().buildObject().with {
        id = 3
        wantAssertionsSigned = false
        authnRequestsSigned = false
        addSupportedProtocol('urn:oasis:names:tc:SAML:2.0:protocol')
        extensions = ExtensionsBuilder.newInstance().buildObject().with {
            unknownXMLObjects.add(EntityAttributesBuilder.newInstance().buildObject().with {
                id = 9
                it.attributes.add(openSAMLObjects.builderFactory.getBuilder(Attribute.DEFAULT_ELEMENT_NAME).buildObject().with {
                    name = "http://scaldingspoon.org/realm"
                    id = 10
                    attributeValues.add(openSAMLObjects.builderFactory.getBuilder(XSString.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSString.TYPE_NAME).with {
                        value = "this is a test"
                        it
                    })
                    it
                })

                it.attributes.add(openSAMLObjects.builderFactory.getBuilder(Attribute.DEFAULT_ELEMENT_NAME).buildObject().with {
                    name = "http://shibboleth.net/ns/profiles/disallowedFeatures"
                    id = 34

                    attributeValues.add(openSAMLObjects.builderFactory.getBuilder(XSAny.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME).with {
                        textContent = "this is an arbitrary String"
                        it
                    })
                    it
                })
                it
            })
            it
        }
        return it
    }
    return it
}

println openSAMLObjects.marshalToXmlString(ed)

println "end"