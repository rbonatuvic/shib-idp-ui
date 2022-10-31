package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

/**
 * ValueXMLObject is an XML Object that has a "value" through String getValue() and void setValue(String) methods
 */
public interface ValueXMLObject {
    String getValue();
    void setValue(String value);
}