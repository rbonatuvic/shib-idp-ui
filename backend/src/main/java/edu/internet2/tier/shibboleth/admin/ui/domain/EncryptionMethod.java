package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.xmlsec.encryption.KeySize;
import org.opensaml.xmlsec.encryption.OAEPparams;

import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class EncryptionMethod extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.saml2.metadata.EncryptionMethod {

    private String algorithm;

    @Embedded
    private KeySize keySize;

    @Embedded
    private OAEPparams oaePparams;


    @Nullable
    @Override
    public String getAlgorithm() {
        return algorithm;
    }

    @Override
    public void setAlgorithm(@Nullable String algorithm) {
        this.algorithm = algorithm;
    }

    @Nullable
    @Override
    public org.opensaml.xmlsec.encryption.KeySize getKeySize() {
        return keySize;
    }

    @Override
    public void setKeySize(@Nullable org.opensaml.xmlsec.encryption.KeySize keySize) {
        this.keySize = keySize;
    }

    @Nullable
    @Override
    public org.opensaml.xmlsec.encryption.OAEPparams getOAEPparams() {
        return oaePparams;
    }

    @Override
    public void setOAEPparams(@Nullable org.opensaml.xmlsec.encryption.OAEPparams oaePparams) {
        this.oaePparams = oaePparams;
    }


}