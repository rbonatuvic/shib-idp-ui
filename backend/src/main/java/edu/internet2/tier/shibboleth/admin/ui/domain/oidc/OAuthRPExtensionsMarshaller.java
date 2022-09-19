package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.io.MarshallingException;
import org.opensaml.saml.common.AbstractSAMLObjectMarshaller;
import org.w3c.dom.Element;

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

public class OAuthRPExtensionsMarshaller extends AbstractSAMLObjectMarshaller {
    @Override
    protected void marshallAttributes(final XMLObject samlElement, final Element domElement) throws MarshallingException {
        final OAuthRPExtensions extensions = (OAuthRPExtensions) samlElement;

        if (extensions.getTokenEndpointAuthMethod() != null) {
            domElement.setAttributeNS(null, TOKEN_ENDPOINT_AUTH_METHOD_ATTRIB_NAME, extensions.getTokenEndpointAuthMethod());
        }

        if (extensions.getGrantTypes() != null) {
            domElement.setAttributeNS(null, GRANT_TYPES_ATTRIB_NAME, extensions.getGrantTypes());
        }

        if (extensions.getResponseTypes() != null) {
            domElement.setAttributeNS(null, RESPONSE_TYPES_ATTRIB_NAME, extensions.getResponseTypes());
        }

        if (extensions.getApplicationType() != null) {
            domElement.setAttributeNS(null, APPLICATION_TYPE_ATTRIB_NAME, extensions.getApplicationType());
        }

        if (extensions.getClientUri() != null) {
            domElement.setAttributeNS(null, CLIENT_URI_ATTRIB_NAME, extensions.getClientUri());
        }

        if (extensions.getScopes() != null) {
            domElement.setAttributeNS(null, SCOPES_ATTRIB_NAME, extensions.getScopes());
        }

        if (extensions.getSoftwareId() != null) {
            domElement.setAttributeNS(null, SOFTWARE_ID_ATTRIB_NAME, extensions.getSoftwareId());
        }

        if (extensions.getSoftwareVersion() != null) {
            domElement.setAttributeNS(null, SOFTWARE_VERSION_ATTRIB_NAME, extensions.getSoftwareVersion());
        }

        if (extensions.getSectorIdentifierUri() != null) {
            domElement.setAttributeNS(null, SECTOR_IDENTIFIER_URI_ATTRIB_NAME, extensions.getSectorIdentifierUri());
        }

        if (extensions.getIdTokenSignedResponseAlg() != null) {
            domElement.setAttributeNS(null, ID_TOKEN_SIGNED_RESPONSE_ALG_ATTRIB_NAME, extensions.getIdTokenSignedResponseAlg());
        }

        if (extensions.getIdTokenEncryptedResponseAlg() != null) {
            domElement.setAttributeNS(null, ID_TOKEN_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME, extensions.getIdTokenEncryptedResponseAlg());
        }

        if (extensions.getIdTokenEncryptedResponseEnc() != null) {
            domElement.setAttributeNS(null, ID_TOKEN_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME, extensions.getIdTokenEncryptedResponseEnc());
        }

        if (extensions.getUserInfoSignedResponseAlg() != null) {
            domElement.setAttributeNS(null, USERINFO_SIGNED_RESPONSE_ALG_ATTRIB_NAME, extensions.getUserInfoSignedResponseAlg());
        }

        if (extensions.getUserInfoEncryptedResponseAlg() != null) {
            domElement.setAttributeNS(null, USERINFO_ENCRYPTED_RESPONSE_ALG_ATTRIB_NAME, extensions.getUserInfoEncryptedResponseAlg());
        }

        if (extensions.getUserInfoEncryptedResponseEnc() != null) {
            domElement.setAttributeNS(null, USERINFO_ENCRYPTED_RESPONSE_ENC_ATTRIB_NAME, extensions.getUserInfoEncryptedResponseEnc());
        }

        if (extensions.getRequestObjectSigningAlg() != null) {
            domElement.setAttributeNS(null, REQUEST_OBJECT_SIGNING_ALG_ATTRIB_NAME, extensions.getRequestObjectSigningAlg());
        }

        if (extensions.getRequestObjectEncryptionAlg() != null) {
            domElement.setAttributeNS(null, REQUEST_OBJECT_ENCRYPTION_ALG_ATTRIB_NAME, extensions.getRequestObjectEncryptionAlg());
        }

        if (extensions.getRequestObjectEncryptionEnc() != null) {
            domElement.setAttributeNS(null, REQUEST_OBJECT_ENCRYPTION_ENC_ATTRIB_NAME, extensions.getRequestObjectEncryptionEnc());
        }

        if (extensions.getTokenEndpointAuthSigningAlg() != null) {
            domElement.setAttributeNS(null, TOKEN_ENDPOINT_AUTH_SIGNING_ALG_ATTRIB_NAME, extensions.getTokenEndpointAuthSigningAlg());
        }

        if (extensions.getInitiateLoginUri() != null) {
            domElement.setAttributeNS(null, INITIATE_LOGIN_URI_ATTRIB_NAME, extensions.getInitiateLoginUri());
        }

        if (extensions.getDefaultMaxAge() != 0) {
            domElement.setAttributeNS(null, DEFAULT_MAX_AGE_ATTRIB_NAME, Integer.toString(extensions.getDefaultMaxAge()));
        }

        if (extensions.isRequireAuthTime()) {
            domElement.setAttributeNS(null, REQUIRE_AUTH_TIME_ATTRIB_NAME, Boolean.toString(extensions.isRequireAuthTime()));
        }

        for (XMLObject xmlObject: extensions.getOrderedChildren()) {
            marshallChildElements(xmlObject, domElement);
        }

        marshallUnknownAttributes(extensions, domElement);
    }
}