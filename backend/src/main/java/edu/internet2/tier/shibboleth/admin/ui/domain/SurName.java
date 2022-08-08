package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class SurName extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.SurName {
    @Column(name = "name")
    private String value;

    @Override
    public String getValue() {
        return value;
    }

    @Override
    public void setValue(String name) {
        this.value = value;
    }
}