package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class RequestedAttribute extends Attribute implements org.opensaml.saml.saml2.metadata.RequestedAttribute {

    private boolean isRequired;

    @Override
    public Boolean isRequired() {
        return isRequired;
    }

    @Override
    public XSBooleanValue isRequiredXSBoolean() {
        return null; //TODO?
    }

    @Override
    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired;
    }

    @Override
    public void setIsRequired(XSBooleanValue xsBooleanValue) {
        //TODO?
    }
}
