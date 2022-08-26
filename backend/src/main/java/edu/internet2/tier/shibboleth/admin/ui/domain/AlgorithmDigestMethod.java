package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity(name = "DigestMethod") // for backwards compatibility instead of dealing with renaming the table
@EqualsAndHashCode(callSuper = true)
public class AlgorithmDigestMethod extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.ext.saml2alg.DigestMethod {
    private String algorithm;

    public AlgorithmDigestMethod() {}

    public AlgorithmDigestMethod(String algorithm) {
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