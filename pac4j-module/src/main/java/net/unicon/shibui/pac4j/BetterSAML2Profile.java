package net.unicon.shibui.pac4j;

import net.unicon.shibui.pac4j.Pac4jConfigurationProperties.SimpleProfileMapping;
import org.pac4j.saml.profile.SAML2Profile;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public class BetterSAML2Profile extends SAML2Profile {
    private SimpleProfileMapping profileMapping;

    public BetterSAML2Profile(final SimpleProfileMapping simpleProfileMapping) {
        this.profileMapping = simpleProfileMapping;
    }

    private String getSingleAttributeValue(Object attribute) {
        if (attribute instanceof Collection) {
            return (String) ((Collection)attribute).toArray()[0];
        }
        return (String) attribute;
    }

    @Override
    public String getEmail() {
        return getSingleAttributeValue(getAttribute(profileMapping.getEmail()));
    }

    @Override
    public String getFamilyName() {
        return getSingleAttributeValue(getAttribute(profileMapping.getLastName()));
    }

    @Override
    public String getFirstName() {
        return getSingleAttributeValue(getAttribute(profileMapping.getFirstName()));
    }

    public List<String> getGroups() {
        return (List<String>) getAttribute(profileMapping.getGroups());
    }

    public Set<String> getRoles() {
        Set<String> result = super.getRoles();
        List<String> assertedRoles = (List<String>) getAttribute(profileMapping.getRoles());
        if (assertedRoles != null) {
            result.addAll(assertedRoles);
        }
        return result;
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