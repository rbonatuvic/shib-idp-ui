package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.xmlsec.signature.DigestMethod;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class SignatureDigestMethod extends AbstractElementExtensibleXMLObject implements DigestMethod {
    private String algorithm;

    public SignatureDigestMethod() {}

    public SignatureDigestMethod(String algorithm) {
        this.algorithm = algorithm;
    }

    @Nullable
    @Override
    public String getAlgorithm() {
        return this.algorithm;
    }

    @Override
    public void setAlgorithm(@Nullable String value) {
        this.algorithm = value;
    }
}