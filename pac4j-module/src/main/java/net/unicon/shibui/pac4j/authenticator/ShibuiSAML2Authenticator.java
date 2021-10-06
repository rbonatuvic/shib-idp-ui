package net.unicon.shibui.pac4j.authenticator;

import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import lombok.AllArgsConstructor;
import org.pac4j.core.context.WebContext;
import org.pac4j.core.profile.CommonProfile;
import org.pac4j.saml.credentials.SAML2Credentials;
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
    public void validate(final SAML2Credentials credentials, final WebContext context) {
        super.validate(credentials, context);
        CommonProfile profile = credentials.getUserProfile();
        profile.setRoles(userService.getUserRoles(profile.getUsername()));
        credentials.setUserProfile(profile);
    }
}