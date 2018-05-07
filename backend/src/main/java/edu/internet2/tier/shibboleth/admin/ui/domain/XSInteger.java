package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class XSInteger extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSInteger {
    private int intValue;

    @Nullable
    @Override
    public Integer getValue() {
        return this.intValue;
    }

    @Override
    public void setValue(@Nullable Integer newValue) {
        this.intValue = newValue;
    }
}
