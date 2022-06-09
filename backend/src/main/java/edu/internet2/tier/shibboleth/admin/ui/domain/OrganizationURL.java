package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class OrganizationURL extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.OrganizationURL {

    private String xMLLang;

    @Column(name="value")
    private String uri;

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
    public String getURI() {
        return uri;
    }

    @Override
    public void setURI(@Nullable String uri) {
        this.uri = uri;
    }
}