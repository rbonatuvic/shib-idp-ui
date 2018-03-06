package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.annotation.Nullable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import java.util.List;

@Entity
public class Keywords extends AbstractXMLObject implements org.opensaml.saml.ext.saml2mdui.Keywords {
    @ElementCollection
    private List<String> keywords;
    private String xmlLang;

    @Override
    public List<String> getKeywords() {
        return this.keywords;
    }

    @Override
    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
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
