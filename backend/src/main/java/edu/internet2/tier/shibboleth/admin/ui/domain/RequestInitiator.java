package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;

public class RequestInitiator extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.ext.saml2mdreqinit.RequestInitiator {
    private String binding;
    @Override
    public String getBinding() {
        return this.binding;
    }

    @Override
    public void setBinding(String binding) {
        this.binding = binding;
    }

    private String location;

    @Override
    public String getLocation() {
        return location;
    }

    @Override
    public void setLocation(String location) {
        this.location = location;
    }

    private String responseLocation;

    @Override
    public String getResponseLocation() {
        return this.responseLocation;
    }

    @Override
    public void setResponseLocation(String location) {
        this.responseLocation = location;
    }

    private AttributeMap attributeMap = new AttributeMap(this);

    @Nonnull
    @Override
    public AttributeMap getUnknownAttributes() {
        return this.attributeMap;
    }
}
