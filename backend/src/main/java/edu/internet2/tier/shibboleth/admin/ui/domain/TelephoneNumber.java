package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class TelephoneNumber extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.TelephoneNumber {

    private String number;

    @Override
    public String getNumber() {
        return number;
    }

    @Override
    public void setNumber(String number) {
        this.number = number;
    }
}
