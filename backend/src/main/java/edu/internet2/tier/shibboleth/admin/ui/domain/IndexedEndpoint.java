package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.persistence.Entity;


@Entity
public class IndexedEndpoint extends Endpoint implements org.opensaml.saml.saml2.metadata.IndexedEndpoint {

    private Integer endpointIndex;

    private Boolean isDefault;

    @Override
    public Integer getIndex() {
        return endpointIndex;
    }

    @Override
    public void setIndex(Integer index) {
        this.endpointIndex = index;
    }

    @Override
    public Boolean isDefault() {
        return isDefault;
    }

    @Override
    public XSBooleanValue isDefaultXSBoolean() {
        if (this.isDefault == null || !this.isDefault) {
            return null;
        }
        return XSBooleanValue.valueOf("true");
    }

    @Override
    public void setIsDefault(Boolean aBoolean) {
        this.isDefault = aBoolean;
    }

    @Override
    public void setIsDefault(XSBooleanValue xsBooleanValue) {
        this.isDefault = xsBooleanValue.getValue();
    }
}
