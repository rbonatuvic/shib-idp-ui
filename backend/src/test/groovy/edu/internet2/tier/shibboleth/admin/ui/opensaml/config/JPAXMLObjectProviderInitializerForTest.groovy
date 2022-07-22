package edu.internet2.tier.shibboleth.admin.ui.opensaml.config

import org.opensaml.core.xml.config.AbstractXMLObjectProviderInitializer

class JPAXMLObjectProviderInitializerForTest extends AbstractXMLObjectProviderInitializer {
    @Override
    protected String[] getConfigResources() {
        return new String[]{
                "/jpa-saml2-metadata-config.xml", "jpa-saml2-metadata-algorithm-config.xml", "jpa-saml2-metadata-ds-config.xml"
        }
    }
}