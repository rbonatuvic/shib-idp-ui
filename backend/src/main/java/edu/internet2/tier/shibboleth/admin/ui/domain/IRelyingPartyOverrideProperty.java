package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.Set;

enum CustomAttributeType {
    BOOLEAN, DOUBLE, DURATION, INTEGER, LONG, SELECTION_LIST, SPRING_BEAN_ID, STRING
}

public interface IRelyingPartyOverrideProperty {
    public String getAttributeFriendlyName();

    public String getAttributeName();
    
    public CustomAttributeType getAttributeType();
    
    public String getDefaultValue();

    public Set<String> getDefaultValues();

    public String getDisplayName();

    public String getDisplayType();

    public Boolean getFromConfigFile();
    
    public String getHelpText();

    public String getInvert();

    public String getName();

    public String getPersistType();

    public String getPersistValue();
    
    public String getTypeForUI();

    public void setAttributeFriendlyName(String attributeFriendlyName);

    public void setAttributeName(String attributeName);

    public void setDefaultValue(String defaultValue);

    public void setDefaultValues(Set<String> defaultValues);

    public void setDisplayName(String displayName);

    public void setDisplayType(String displayType);

    public void setHelpText(String helpText);

    public void setInvert(String invert);

    public void setName(String name);

    public void setPersistType(String persistType);

    public void setPersistValue(String persistValue);
}
