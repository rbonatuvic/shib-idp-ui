package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.hibernate.annotations.Type;
import org.joda.time.DateTime;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.saml2.common.CacheableSAMLObject;
import org.opensaml.saml.saml2.common.TimeBoundSAMLObject;
import org.opensaml.xmlsec.signature.Signature;
import org.opensaml.xmlsec.signature.SignableXMLObject;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
import java.util.List;


@MappedSuperclass
public abstract class AbstractDescriptor extends AbstractAttributeExtensibleXMLObject implements CacheableSAMLObject, TimeBoundSAMLObject, SignableXMLObject {
    private Long cacheDuration;

    @Type(type = "org.jadira.usertype.dateandtime.joda.PersistentDateTime")
    private DateTime validUntil;

    private boolean isSigned;

    private String signatureReferenceID;

    @OneToOne(cascade = CascadeType.ALL)
    private Extensions extensions;

    @Override
    public boolean isValid() {
        if (null == validUntil) {
            return true;
        }
        return new DateTime().isBefore(this.validUntil);
    }

    @Override
    public Long getCacheDuration() {
        return cacheDuration;
    }

    @Override
    public void setCacheDuration(Long cacheDuration) {
        this.cacheDuration = cacheDuration;
    }

    @Override
    public DateTime getValidUntil() {
        return validUntil;
    }

    @Override
    public void setValidUntil(DateTime validUntil) {
        this.validUntil = validUntil;
    }

    @Override
    public boolean isSigned() {
        return isSigned;
    }

    public void setIsSigned(boolean isSigned) {
        this.isSigned = isSigned;
    }

    public Extensions getExtensions() {
        return extensions;
    }

    public void setExtensions(org.opensaml.saml.saml2.metadata.Extensions extensions) {
        this.extensions = (Extensions)extensions;
    }

    public String getSignatureReferenceID() {
        return signatureReferenceID;
    }

    public void setSignatureReferenceID(String signatureReferenceID) {
        this.signatureReferenceID = signatureReferenceID;
    }

    @Nullable
    @Override
    public Signature getSignature() {
        return null; //TODO signing xml, so generate xml and pass through signing method here or dto layer?
    }

    @Override
    public void setSignature(@Nullable Signature signature) {
        //TODO see above need to generate xml and pass through signing method here or in dto layer?
    }

    @Nullable
    public List<XMLObject> getOrderedChildren() {

        return null; //TODO ?
    }
}
