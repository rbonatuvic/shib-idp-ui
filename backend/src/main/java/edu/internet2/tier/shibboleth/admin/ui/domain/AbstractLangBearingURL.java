package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.saml.saml2.metadata.LocalizedURI;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class AbstractLangBearingURL extends XSURI implements LocalizedURI {
    @Column(name = "informationUrlXmlLang")
    private String xmlLang;

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
