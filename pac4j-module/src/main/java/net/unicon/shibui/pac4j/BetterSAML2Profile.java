package net.unicon.shibui.pac4j;

import org.pac4j.saml.profile.SAML2Profile;

import java.util.Collection;

public class BetterSAML2Profile extends SAML2Profile {
    private final String usernameAttribute;

    public BetterSAML2Profile(final String usernameAttribute) {
        this.usernameAttribute = usernameAttribute;
    }

    @Override
    public String getUsername() {
        Object username = getAttribute(usernameAttribute);
        if (username instanceof Collection) {
            return (String) ((Collection)username).toArray()[0];
        } else {
            return (String) username;
        }
    }
}
