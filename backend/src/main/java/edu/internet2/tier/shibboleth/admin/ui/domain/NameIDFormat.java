package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.persistence.Entity;

@Entity
public class NameIDFormat extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.NameIDFormat {

    private String format;


    @Override
    public String getFormat() {
        return format;
    }

    @Override
    public void setFormat(String format) {
        this.format = format;
    }
}
