package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
public class SigningMethod extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.ext.saml2alg.SigningMethod {
    private String algorithm;
    private Integer minKeySize;
    private Integer maxKeySize;

    public SigningMethod() {}

    public SigningMethod(String algorithm, Integer minKeySize, Integer maxKeySize) {
        this.algorithm = algorithm;
        this.minKeySize = minKeySize;
        this.maxKeySize = maxKeySize;
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

    @Nullable
    @Override
    public Integer getMinKeySize() {
        return this.minKeySize;
    }

    @Override
    public void setMinKeySize(@Nullable Integer value) {
        this.minKeySize = value;
    }

    @Nullable
    @Override
    public Integer getMaxKeySize() {
        return this.maxKeySize;
    }

    @Override
    public void setMaxKeySize(@Nullable Integer value) {
        this.maxKeySize = value;
    }
}
