package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.security.credential.UsageType;
import org.opensaml.xmlsec.signature.KeyInfo;

import javax.annotation.Nullable;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class KeyDescriptor extends AbstractXMLObject implements org.opensaml.saml.saml2.metadata.KeyDescriptor {

    @Column(name = "keyDescriptorName")
    private String name;
    private String usageType;

    @OneToOne(cascade = CascadeType.ALL)
    private edu.internet2.tier.shibboleth.admin.ui.domain.KeyInfo keyInfo;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "keydesc_encryptionmethod_id")
    private List<EncryptionMethod> encryptionMethods = new ArrayList<>();

    @Override
    public UsageType getUse() {
        if (this.usageType == null) {
            return null;
        }
        return UsageType.valueOf(this.usageType.toUpperCase());
    }

    @Override
    public void setUse(UsageType usageType) {
        this.usageType = usageType.toString().toLowerCase();
    }

    public void setUsageType(String usageType) {
        this.usageType = usageType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public org.opensaml.xmlsec.signature.KeyInfo getKeyInfo() {
        return keyInfo;
    }

    @Override
    public void setKeyInfo(KeyInfo keyInfo) {
        this.keyInfo = (edu.internet2.tier.shibboleth.admin.ui.domain.KeyInfo) keyInfo; //TODO
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.EncryptionMethod> getEncryptionMethods() {
        return (List<org.opensaml.saml.saml2.metadata.EncryptionMethod>)(List<? extends org.opensaml.saml.saml2.metadata.EncryptionMethod>) encryptionMethods;
    }

    public void setEncryptionMethods(List<EncryptionMethod> encryptionMethods) {
        this.encryptionMethods = encryptionMethods;
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        children.add(this.keyInfo);
        if (this.encryptionMethods != null) {
            children.addAll(this.encryptionMethods);
        }

        return children;
    }
}
