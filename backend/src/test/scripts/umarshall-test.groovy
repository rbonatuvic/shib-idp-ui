import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.opensaml.saml.saml2.core.AttributeValue

println "start"

def openSAMLObjects = new OpenSamlObjects().with {
    it.init()
    return it
}

def file = new File('../resources/metadata/metadata.xml')

def here = openSAMLObjects.unmarshalFromXml(file.getBytes())

println "end"