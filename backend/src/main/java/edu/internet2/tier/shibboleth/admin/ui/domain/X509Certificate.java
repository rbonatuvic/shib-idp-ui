package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.ValueXMLObject;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class X509Certificate extends AbstractXMLObject implements ValueXMLObject, org.opensaml.xmlsec.signature.X509Certificate {
    @Column(name = "x509CertificateValue")
    @Lob
    @Type(type = "org.hibernate.type.TextType")
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