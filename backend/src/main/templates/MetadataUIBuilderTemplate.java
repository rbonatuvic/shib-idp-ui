package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractSAMLObjectBuilder;
import org.opensaml.saml.common.xml.SAMLConstants;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class {{TOKEN}}Builder extends AbstractSAMLObjectBuilder<{{TOKEN}}> {
    @Nonnull
    @Override
    public {{TOKEN}} buildObject() {
        return buildObject(SAMLConstants.SAML20MDUI_NS, org.opensaml.saml.ext.saml2mdui.{{TOKEN}}.DEFAULT_ELEMENT_LOCAL_NAME, SAMLConstants.SAML20MDUI_PREFIX);
    }

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
