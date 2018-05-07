package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class XSString extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSString {
    private String xsStringvalue;

    @Nullable
    @Override
    public String getValue() {
        return this.xsStringvalue;
    }

    @Override
    public void setValue(@Nullable String newValue) {
        this.xsStringvalue = newValue;
    }
}
