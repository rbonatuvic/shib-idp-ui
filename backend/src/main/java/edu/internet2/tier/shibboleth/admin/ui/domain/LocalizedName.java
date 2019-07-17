package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
@Audited
public class LocalizedName extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.LocalizedName {

    private String xMLLang;

    private String value;

    @Nullable
    @Override
    public String getXMLLang() {
        return xMLLang;
    }

    @Override
    public void setXMLLang(@Nullable String xmllang) {
        this.xMLLang = xmllang;
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
