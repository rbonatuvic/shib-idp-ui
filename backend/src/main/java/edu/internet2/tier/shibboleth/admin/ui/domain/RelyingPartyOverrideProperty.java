package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.Collection;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayType() {
        return displayType;
    }

    public void setDisplayType(String displayType) {
        this.displayType = displayType;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public String getHelpText() {
        return helpText;
    }

    public void setHelpText(String helpText) {
        this.helpText = helpText;
    }

    public String getPersistType() {
        return persistType;
    }

    public void setPersistType(String persistType) {
        this.persistType = persistType;
    }

    public String getPersistValue() {
        return persistValue;
    }

    public void setPersistValue(String persistValue) {
        this.persistValue = persistValue;
    }

    public List<String> getDefaultValues() {
        return defaultValues;
    }

    public void setDefaultValues(List<String> defaultValues) {
        this.defaultValues = defaultValues;
    }

    public String getAttributeName() {
        return attributeName;
    }

    public void setAttributeName(String attributeName) {
        this.attributeName = attributeName;
    }

    public String getAttributeFriendlyName() {
        return attributeFriendlyName;
    }

    public void setAttributeFriendlyName(String attributeFriendlyName) {
        this.attributeFriendlyName = attributeFriendlyName;
    }

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