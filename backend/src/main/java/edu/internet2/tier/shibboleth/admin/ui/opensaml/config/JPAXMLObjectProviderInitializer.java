package edu.internet2.tier.shibboleth.admin.ui.opensaml.config;

import org.opensaml.core.xml.config.AbstractXMLObjectProviderInitializer;

public class JPAXMLObjectProviderInitializer extends AbstractXMLObjectProviderInitializer {

    @Override
    protected String[] getConfigResources() {
        return new String[]{
                "/jpa-default-config.xml",
                "/jpa-encryption-config.xml",
                "/jpa-saml2-assertion-config.xml",
                "/jpa-saml2-metadata-algorithm-config.xml",
                "/jpa-saml2-metadata-attr-config.xml",
                "/jpa-saml2-metadata-config.xml",
                "/jpa-saml2-metadata-reqinit-config.xml",
                "/jpa-saml2-metadata-ui-config.xml",
                "/jpa-schema-config.xml",
                "/jpa-signature-config.xml",
                "/saml2-protocol-config.xml",
                "/modified-saml2-assertion-config.xml",
                "/jpa-shib-oidc-config.xml"
        };
    }
}