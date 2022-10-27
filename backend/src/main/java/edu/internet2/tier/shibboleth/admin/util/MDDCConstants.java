package edu.internet2.tier.shibboleth.admin.util;

import org.opensaml.saml.common.xml.SAMLConstants;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class MDDCConstants {
    public static final String RELEASE_ATTRIBUTES = "http://shibboleth.net/ns/attributes/releaseAllValues";

    public static final String SIGN_ASSERTIONS = "http://shibboleth.net/ns/profiles/saml2/sso/browser/signAssertions";
    public static final String SIGN_ASSERTIONS_FN = "signAssertions";

    public static final String SIGN_RESPONSES = "http://shibboleth.net/ns/profiles/saml2/sso/browser/signResponses";
    public static final String SIGN_RESPONSES_FN = "signResponses";

    public static final String ENCRYPT_ASSERTIONS = "http://shibboleth.net/ns/profiles/encryptAssertions";
    public static final String ENCRYPT_ASSERTIONS_FN = "encryptAssertions";

    public static final String SECURITY_CONFIGURATION = "http://shibboleth.net/ns/profiles/securityConfiguration";
    public static final String SECURITY_CONFIGURATION_FN = "securityConfiguration";

    public static final String DISALLOWED_FEATURES = "http://shibboleth.net/ns/profiles/disallowedFeatures";
    public static final String DISALLOWED_FEATURES_FN = "disallowedFeatures";

    public static final String INCLUDE_CONDITIONS_NOT_BEFORE = "http://shibboleth.net/ns/profiles/includeConditionsNotBefore";
    public static final String INCLUDE_CONDITIONS_NOT_BEFORE_FN = "includeConditionsNotBefore";

    public static final String RESPONDER_ID = "http://shibboleth.net/ns/profiles/responderId";
    public static final String RESPONDER_ID_FN = "responderId";

    public static final String NAME_ID_FORMAT_PRECEDENCE = "http://shibboleth.net/ns/profiles/nameIDFormatPrecedence";
    public static final String NAME_ID_FORMAT_PRECEDENCE_FN = "nameIDFormatPrecedence";

    public static final String DEFAULT_AUTHENTICATION_METHODS = "http://shibboleth.net/ns/profiles/defaultAuthenticationMethods";
    public static final String DEFAULT_AUTHENTICATION_METHODS_FN = "defaultAuthenticationMethods";

    public static final String FORCE_AUTHN = "http://shibboleth.net/ns/profiles/forceAuthn";
    public static final String FORCE_AUTHN_FN = "forceAuthn";

    public static final Map<String, String> PROTOCOL_BINDINGS;

    static {
        Map<String, String> map = new HashMap<>();
        //TODO: this may not be right
        map.put("SAML 2", SAMLConstants.SAML20P_NS);
        map.put("SAML 1.1", SAMLConstants.SAML11P_NS);

        // TODO: right now we're lazy 'cause this is small. reevaluate later
        map.put(SAMLConstants.SAML20P_NS, "SAML 2");
        map.put(SAMLConstants.SAML11P_NS, "SAML 1.1");

        map.put("http://openid.net/specs/openid-connect-core-1_0.html", "http://openid.net/specs/openid-connect-core-1_0.html");

        PROTOCOL_BINDINGS = Collections.unmodifiableMap(map);
    }
}