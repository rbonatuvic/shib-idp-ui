package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
public class OrganizationURL extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.OrganizationURL {

    private String xMLLang;

    private String value;

    @Nullable
    @Override
    public String getXMLLang() {
        return xMLLang; //TODO implement langbearing used x2
    }

    @Override
    public void setXMLLang(@Nullable String xmlLang) {
        this.xMLLang = xmlLang;
    }

    @Nullable
    @Override
    public String getValue() {
        return value;
    }

    @Override
    public void setValue(@Nullable String value) {
        this.value = value;
    }
}
