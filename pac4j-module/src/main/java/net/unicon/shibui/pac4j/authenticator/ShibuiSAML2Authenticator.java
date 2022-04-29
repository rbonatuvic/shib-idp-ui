package net.unicon.shibui.pac4j.authenticator;

import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.context.session.SessionStore;
import org.pac4j.core.credentials.Credentials;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.saml.credentials.authenticator.SAML2Authenticator;

import java.util.Map;

public class ShibuiSAML2Authenticator extends SAML2Authenticator {
    private final UserService userService;

    public ShibuiSAML2Authenticator(final String attributeAsId, final Map<String, String> mappedAttributes, UserService userService) {
        super(attributeAsId, mappedAttributes);
        this.userService = userService;
    }

    /**
     * After setting up the information for the user from the SAML, add user roles from the DB if they exist
     * @param credentials
     * @param context
     */
    @Override
    public void validate(final Credentials credentials, final WebContext context, final SessionStore sessionStore) {
        super.validate(credentials, context, sessionStore);
        CommonProfile profile = (CommonProfile) credentials.getUserProfile();
        profile.setRoles(userService.getUserRoles(profile.getUsername()));
        credentials.setUserProfile(profile);
    }
}