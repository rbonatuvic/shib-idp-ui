package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class Description extends AbstractXMLObject implements org.opensaml.saml.ext.saml2mdui.Description {

    @Column(name = "descriptionXMLLang")
    private String xmlLang;

    @Column(name = "descriptionValue")
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String value;

    @Nullable
    @Override
    public String getXMLLang() {
        return this.xmlLang;
    }

    @Override
    public void setXMLLang(@Nullable String xmlLang) {
        this.xmlLang = xmlLang;
    }

    @Nullable
    @Override
    public String getValue() {
        return this.value;
    }

    @Override
    public void setValue(@Nullable String value) {
        this.value = value;
    }
}