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
    private String helpText;
    private String persistType;
    private String persistValue;
    private List<String> defaultValues;
    private Collection<String> persistValues;

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

    public Collection<String> getPersistValues() {
        return persistValues;
    }

    public void setPersistValues(Collection<String> persistValues) {
        this.persistValues = persistValues;
    }

    @Override
    public String toString() {
        return "RelyingPartyOverrideProperty{" + "\nname='" + name + '\'' + ", \ndisplayName='" + displayName + '\'' + ", \ndisplayType='" + displayType + '\'' + ", \nhelpText='" + helpText + '\'' + ", \npersistType='" + persistType + '\'' + ", \npersistValue='" + persistValue + '\'' + ", \ndefaultValues=" + defaultValues + ", \npersistValues=" + persistValues + "\n}";
    }
}