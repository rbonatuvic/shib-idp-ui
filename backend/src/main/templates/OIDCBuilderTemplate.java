package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractSAMLObjectBuilder;
import net.shibboleth.oidc.saml.xmlobject.Constants;

public class {{TOKEN}}Builder extends AbstractSAMLObjectBuilder<{{TOKEN}}> {
    public {{TOKEN}}Builder() {
    }

    public {{TOKEN}} buildObject() {
        return buildObject(Constants.SAML20MDOIDCMD_NS, {{TOKEN}}.DEFAULT_ELEMENT_LOCAL_NAME, Constants.SAML20MDOIDCMD_PREFIX);
    }

    public {{TOKEN}} buildObject(final String namespaceURI, final String localName, final String namespacePrefix) {
        {{TOKEN}} o = new {{TOKEN}}();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }
}