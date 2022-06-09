package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class XSURI extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSURI {
    @Column(name = "xsuriValue")
    private String uri;

    @Nullable
    @Override
    public String getURI() {
        return this.uri;
    }

    @Override
    public void setURI(@Nullable String uri) {
        this.uri = uri;
    }
}