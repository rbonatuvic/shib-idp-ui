package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.persistence.Entity;


@Entity
public class Company extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.Company {

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
