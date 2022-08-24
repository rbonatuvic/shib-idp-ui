package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractXMLObjectBuilder;
import org.opensaml.xmlsec.signature.support.SignatureConstants;

public class {{TOKEN}}Builder extends AbstractXMLObjectBuilder<{{TOKEN}}> {
    public {{TOKEN}}Builder() {
    }

    public {{TOKEN}} buildObject() {
        return buildObject(SignatureConstants.XMLSIG_NS, {{TOKEN}}.DEFAULT_ELEMENT_LOCAL_NAME,
                SignatureConstants.XMLSIG_PREFIX);
    }

    public {{TOKEN}} buildObject(final String namespaceURI, final String localName, final String namespacePrefix) {
        {{TOKEN}} o = new {{TOKEN}}();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }
}