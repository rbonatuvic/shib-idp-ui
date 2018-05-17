package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class XSURI extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSURI {
    @Column(name = "xsuriValue")
    private String value;

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
