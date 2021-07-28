package net.unicon.shibui.pac4j;

import org.pac4j.saml.profile.SAML2Profile;

import net.unicon.shibui.pac4j.Pac4jConfigurationProperties.SimpleProfileMapping;

import java.util.Collection;

public class BetterSAML2Profile extends SAML2Profile {
    private SimpleProfileMapping profileMapping;

    public BetterSAML2Profile(final SimpleProfileMapping simpleProfileMapping) {
        this.profileMapping = simpleProfileMapping;
    }

    @Override
    public String getEmail() {
        return (String) getAttribute(profileMapping.getEmail());
    }

    @Override
    public String getFamilyName() {
        return (String) getAttribute(profileMapping.getLastName());
    }

    @Override
    public String getFirstName() {
        return (String) getAttribute(profileMapping.getFirstName());
    }

    @Override
    public String getUsername() {
        Object username = getAttribute(profileMapping.getUsername());
        if (username instanceof Collection) {
            return (String) ((Collection) username).toArray()[0];
        } else {
            return (String) username;
        }
    }

}
