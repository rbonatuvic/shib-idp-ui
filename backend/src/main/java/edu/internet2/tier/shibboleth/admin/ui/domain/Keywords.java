package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OrderColumn;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
public class Keywords extends AbstractXMLObject implements org.opensaml.saml.ext.saml2mdui.Keywords {
    @ElementCollection
    @OrderColumn
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
