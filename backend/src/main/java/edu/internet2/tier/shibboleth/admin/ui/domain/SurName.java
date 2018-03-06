package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.persistence.Entity;

@Entity
public class SurName extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.SurName {

    private String name;

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }
}
