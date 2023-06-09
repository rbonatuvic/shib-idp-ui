package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class XSBase64Binary extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSBase64Binary {
    private String b64value;

    @Nullable
    @Override
    public String getValue() {
        return this.b64value;
    }

    @Override
    public void setValue(@Nullable String newValue) {
        this.b64value = newValue;
    }
}
