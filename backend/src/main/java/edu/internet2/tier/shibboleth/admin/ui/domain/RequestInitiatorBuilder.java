package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.saml.common.AbstractSAMLObjectBuilder;
import org.opensaml.saml.common.xml.SAMLConstants;
import org.w3c.dom.Element;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.xml.namespace.QName;

public class RequestInitiatorBuilder extends AbstractSAMLObjectBuilder<RequestInitiator> {

    /**
     * Constructor.
     */
    public RequestInitiatorBuilder() {

    }

    /** {@inheritDoc} */
    public RequestInitiator buildObject() {
        return buildObject(SAMLConstants.SAML20MDRI_NS, org.opensaml.saml.ext.saml2mdreqinit.RequestInitiator.DEFAULT_ELEMENT_LOCAL_NAME,
                SAMLConstants.SAML20MDRI_PREFIX);
    }

    /** {@inheritDoc} */
    public RequestInitiator buildObject(final String namespaceURI, final String localName,
                                        final String namespacePrefix) {
        RequestInitiator o = new RequestInitiator();
        o.setNamespaceURI(namespaceURI);
        o.setElementLocalName(localName);
        o.setNamespacePrefix(namespacePrefix);
        return o;
    }

    @Nonnull
    @Override
    public RequestInitiator buildObject(@Nullable String namespaceURI, @Nonnull String localName, @Nullable String namespacePrefix, @Nullable QName schemaType) {
        RequestInitiator requestInitiator = buildObject(namespaceURI, localName, namespacePrefix);
        requestInitiator.setSchemaType(schemaType);
        return requestInitiator;
    }
}