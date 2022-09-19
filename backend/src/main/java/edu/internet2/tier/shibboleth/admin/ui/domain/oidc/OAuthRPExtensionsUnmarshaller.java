package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import org.apache.commons.lang3.StringUtils;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.io.UnmarshallingException;
import org.opensaml.saml.common.AbstractSAMLObjectUnmarshaller;
import org.w3c.dom.Attr;

import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.APPLICATION_TYPE_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.CLIENT_URI_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.DEFAULT_MAX_AGE_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.GRANT_TYPES_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.ID_TOKEN_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.ID_TOKEN_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.ID_TOKEN_SIGNED_RESPONSE_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.INITIATE_LOGIN_URI_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.REQUEST_OBJECT_ENCRYPTION_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.REQUEST_OBJECT_ENCRYPTION_ENC_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.REQUEST_OBJECT_SIGNING_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.REQUIRE_AUTH_TIME_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.RESPONSE_TYPES_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.SCOPES_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.SECTOR_IDENTIFIER_URI_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.SOFTWARE_ID_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.SOFTWARE_VERSION_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.TOKEN_ENDPOINT_AUTH_METHOD_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.TOKEN_ENDPOINT_AUTH_SIGNING_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.USERINFO_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.USERINFO_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME;
import static net.shibboleth.oidc.saml.xmlobject.OAuthRPExtensions.USERINFO_SIGNED_RESPONSE_ALG_ATTRIB_NAME;

public class OAuthRPExtensionsUnmarshaller extends AbstractSAMLObjectUnmarshaller {
    protected void processChildElement(final XMLObject parentSAMLObject, final XMLObject childSAMLObject) throws UnmarshallingException {
        final OAuthRPExtensions extensions = (OAuthRPExtensions) parentSAMLObject;

        if (childSAMLObject instanceof DefaultAcrValue) {
            extensions.addDefaultAcrValue((DefaultAcrValue) childSAMLObject);
        } else if (childSAMLObject instanceof RequestUri) {
            extensions.addRequestUri((RequestUri) childSAMLObject);
        } else if (childSAMLObject instanceof PostLogoutRedirectUri) {
            extensions.addPostLogoutRedirectUri((PostLogoutRedirectUri) childSAMLObject);
        } else {
            extensions.getUnknownXMLObjects().add(childSAMLObject);
        }
    }
    
    protected void processAttribute(final XMLObject samlObject, final Attr attribute) throws UnmarshallingException {
        final OAuthRPExtensions extensions = (OAuthRPExtensions) samlObject;

        if (attribute.getNamespaceURI() == null) {
            if (attribute.getLocalName().equals(DEFAULT_MAX_AGE_ATTRIB_NAME) && StringUtils.isNotEmpty(attribute.getValue())) {
                extensions.setDefaultMaxAge(Integer.parseInt(attribute.getValue()));
            } else if (attribute.getLocalName().equals(REQUIRE_AUTH_TIME_ATTRIB_NAME) && StringUtils.isNotEmpty(attribute.getValue())) {
                extensions.setRequireAuthTime(Boolean.parseBoolean(attribute.getValue()));
            } else if (attribute.getLocalName().equals(TOKEN_ENDPOINT_AUTH_METHOD_ATTRIB_NAME)) {
                extensions.setTokenEndpointAuthMethod(attribute.getValue());
            } else if (attribute.getLocalName().equals(GRANT_TYPES_ATTRIB_NAME)) {
                extensions.setGrantTypes(attribute.getValue());
            } else if (attribute.getLocalName().equals(RESPONSE_TYPES_ATTRIB_NAME)) {
                extensions.setResponseTypes(attribute.getValue());
            } else if (attribute.getLocalName().equals(APPLICATION_TYPE_ATTRIB_NAME)) {
                extensions.setApplicationType(attribute.getValue());
            } else if (attribute.getLocalName().equals(CLIENT_URI_ATTRIB_NAME)) {
                extensions.setClientUri(attribute.getValue());
            } else if (attribute.getLocalName().equals(SCOPES_ATTRIB_NAME)) {
                extensions.setScopes(attribute.getValue());
            } else if (attribute.getLocalName().equals(SOFTWARE_ID_ATTRIB_NAME)) {
                extensions.setSoftwareId(attribute.getValue());
            } else if (attribute.getLocalName().equals(SOFTWARE_VERSION_ATTRIB_NAME)) {
                extensions.setSoftwareVersion(attribute.getValue());
            } else if (attribute.getLocalName().equals(SECTOR_IDENTIFIER_URI_ATTRIB_NAME)) {
                extensions.setSectorIdentifierUri(attribute.getValue());
            } else if (attribute.getLocalName().equals(ID_TOKEN_SIGNED_RESPONSE_ALG_ATTRIB_NAME)) {
                extensions.setIdTokenSignedResponseAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(ID_TOKEN_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME)) {
                extensions.setIdTokenEncryptedResponseAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(ID_TOKEN_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME)) {
                extensions.setIdTokenEncryptedResponseEnc(attribute.getValue());
            } else if (attribute.getLocalName().equals(USERINFO_SIGNED_RESPONSE_ALG_ATTRIB_NAME)) {
                extensions.setUserInfoSignedResponseAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(USERINFO_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME)) {
                extensions.setUserInfoEncryptedResponseAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(USERINFO_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME)) {
                extensions.setUserInfoEncryptedResponseEnc(attribute.getValue());
            } else if (attribute.getLocalName().equals(REQUEST_OBJECT_SIGNING_ALG_ATTRIB_NAME)) {
                extensions.setRequestObjectSigningAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(REQUEST_OBJECT_ENCRYPTION_ALG_ATTRIB_NAME)) {
                extensions.setRequestObjectEncryptionAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(REQUEST_OBJECT_ENCRYPTION_ENC_ATTRIB_NAME)) {
                extensions.setRequestObjectEncryptionEnc(attribute.getValue());
            } else if (attribute.getLocalName().equals(TOKEN_ENDPOINT_AUTH_SIGNING_ALG_ATTRIB_NAME)) {
                extensions.setTokenEndpointAuthSigningAlg(attribute.getValue());
            } else if (attribute.getLocalName().equals(INITIATE_LOGIN_URI_ATTRIB_NAME)) {
                extensions.setInitiateLoginUri(attribute.getValue());
            } else {
                super.processAttribute(samlObject, attribute);
            }
        } else {
            processUnknownAttribute(extensions, attribute);
        }
    }
}