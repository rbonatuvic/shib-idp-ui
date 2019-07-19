package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.xml.AbstractSAMLObjectBuilder;
import org.opensaml.saml.common.xml.SAMLConstants;

public class {{TOKEN}}Builder extends AbstractSAMLObjectBuilder<{{TOKEN}}> {
    public {{TOKEN}}Builder() {
    }

    public {{TOKEN}} buildObject() {
        return buildObject(SAMLConstants.SAML20ALG_NS, {{TOKEN}}.DEFAULT_ELEMENT_LOCAL_NAME,
                SAMLConstants.SAML20ALG_PREFIX);
    }

    public {{TOKEN}} buildObject(final String namespaceURI, final String localName, final String namespacePrefix) {
        {{TOKEN}} o = new {{TOKEN}}();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }
}
