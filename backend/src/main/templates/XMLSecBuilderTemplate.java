package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractXMLObjectBuilder;
import org.opensaml.xmlsec.signature.XMLSignatureBuilder;
import org.opensaml.xmlsec.signature.support.SignatureConstants;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class {{TOKEN}}Builder extends AbstractXMLObjectBuilder<org.opensaml.xmlsec.signature.{{TOKEN}}> implements XMLSignatureBuilder<org.opensaml.xmlsec.signature.{{TOKEN}}> {
    public {{TOKEN}}Builder() {}

    @Nonnull
    @Override
    public {{TOKEN}} buildObject(@Nullable String namespaceURI, @Nonnull String localName, @Nullable String namespacePrefix) {
        {{TOKEN}} o = new {{TOKEN}}();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }

    public {{TOKEN}} buildObject() {
        return buildObject(SignatureConstants.XMLSIG_NS, {{TOKEN}}.DEFAULT_ELEMENT_LOCAL_NAME,
        SignatureConstants.XMLSIG_PREFIX);
    }
}
