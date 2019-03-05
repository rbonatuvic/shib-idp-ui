package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Setter
@Getter
public class RelyingPartyOverrideProperty {
    private String name;
    private String displayName;
    private String displayType;
    private String defaultValue;
    private String helpText;
    private List<String> defaultValues;
    private String persistType;
    private String persistValue;
    private String attributeName;
    private String attributeFriendlyName;
    private String invert;

    @Override
    public String toString() {
        return "RelyingPartyOverrideProperty{"
                + "\nname='" + name + '\''
                + ", \ndisplayName='" + displayName + '\''
                + ", \ndisplayType='" + displayType + '\''
                + ", \ndefaultValue='" + defaultValue + '\''
                + ", \nhelpText='" + helpText + '\''
                + ", \npersistType='" + persistType + '\''
                + ", \npersistValue='" + persistValue + '\''
                + ", \ndefaultValues=" + defaultValues
                + ", \nattributeName='" + attributeName + '\''
                + ", \nattributeFriendlyName='" + attributeFriendlyName + '\''
                + "\n}";
    }
}