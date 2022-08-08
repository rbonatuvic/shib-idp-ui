package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class Logo extends AbstractXMLObject implements org.opensaml.saml.ext.saml2mdui.Logo {
    @Column(name = "logUrl")
    private String uri;

    @Column(name = "logoHieght")
    private int height;

    @Column(name = "logoWidth")
    private int width;

    @Column(name = "logoXmlLang")
    private String xmlLang;

    @Override
    public String getURI() {
        return this.uri;
    }

    @Override
    public void setURI(String uri) {
        this.uri = uri;
    }

    @Override
    public Integer getHeight() {
        return this.height;
    }

    @Override
    public void setHeight(Integer height) {
        this.height = height;
    }

    @Override
    public Integer getWidth() {
        return this.width;
    }

    @Override
    public void setWidth(Integer width) {
        this.width = width;
    }

    @Nullable
    @Override
    public String getXMLLang() {
        return this.xmlLang;
    }

    @Override
    public void setXMLLang(@Nullable String xmlLang) {
        this.xmlLang = xmlLang;
    }
}