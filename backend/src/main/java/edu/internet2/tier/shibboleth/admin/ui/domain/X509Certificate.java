package edu.internet2.tier.shibboleth.admin.ui.domain;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
public class X509Certificate extends AbstractXMLObject implements org.opensaml.xmlsec.signature.X509Certificate {
    @Column(name = "x509CertificateValue")
    @Lob
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
