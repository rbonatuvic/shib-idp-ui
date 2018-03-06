package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

public class AssertionConsumerServiceRepresentation implements Serializable {

    private static final long serialVersionUID = 7610150456756113460L;

    private String locationUrl;

    private String binding;

    private boolean makeDefault;

    public String getLocationUrl() {
        return locationUrl;
    }

    public void setLocationUrl(String locationUrl) {
        this.locationUrl = locationUrl;
    }

    public String getBinding() {
        return binding;
    }

    public void setBinding(String binding) {
        this.binding = binding;
    }

    public boolean isMakeDefault() {
        return makeDefault;
    }

    public void setMakeDefault(boolean makeDefault) {
        this.makeDefault = makeDefault;
    }
}
