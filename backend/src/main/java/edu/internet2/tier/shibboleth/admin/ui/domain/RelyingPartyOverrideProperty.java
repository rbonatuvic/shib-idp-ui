package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.Set;

import org.apache.commons.lang3.StringUtils;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

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
    private String protocol = "saml";
    
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

    public String getProtocol() {
        return protocol == null ? "saml" : protocol;
    }

    public String getTypeForUI() {
        return getDisplayType();
    }
    
    public void setDefaultValues(Set<String> defaults) {
        defaultValues = defaults;
        examples = defaults;        
    }
}