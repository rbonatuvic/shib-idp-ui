package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Setter
@Getter
@ToString
public class RelyingPartyOverrideProperty implements IRelyingPartyOverrideProperty {
    private String attributeFriendlyName;
    private String attributeName;
    private String defaultValue;
    private Set<String> defaultValues;
    private String displayName;
    private String displayType;
    private Set<String> examples;
    private String helpText;
    private String invert;
    private String name;
    private String persistType;
    private String persistValue;
    private String protocol = "saml, oidc";
    
    @Override
    public Boolean getFromConfigFile() {
        return Boolean.TRUE;
    }

    @Override
    public CustomAttributeType getAttributeType() {
        switch (displayType) {
        case ("set"):
        case ("list"):
            return CustomAttributeType.SELECTION_LIST;
        default:
            return CustomAttributeType.valueOf(displayType.toUpperCase());
        }
    }

    @Override
    public String getProtocol() {
        return protocol == null ? "saml, oidc" : protocol;
    }

    public String getTypeForUI() {
        return getDisplayType();
    }
    
    public void setDefaultValues(Set<String> defaults) {
        defaultValues = defaults;
        examples = defaults;        
    }
}