package net.unicon.shibui.pac4j;

import net.unicon.shibui.pac4j.Pac4jConfigurationProperties.SimpleProfileMapping;
import org.pac4j.saml.profile.SAML2Profile;

import java.util.Collection;
import java.util.List;

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

    public List<String> getGroups() {
        return (List<String>) getAttribute(profileMapping.getGroupsName());
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