package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractXMLObjectBuilder;
import org.opensaml.saml.common.xml.SAMLConstants;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class {{TOKEN}}Builder extends AbstractXMLObjectBuilder<{{TOKEN}}> {

    @Nonnull
    @Override
    public {{TOKEN}} buildObject(@Nullable String namespaceURI, @Nonnull String localName, @Nullable String namespacePrefix) {
        {{TOKEN}} o = new {{TOKEN}}();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }
}
