package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;
import org.joda.time.DateTime;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.saml.saml2.common.CacheableSAMLObject;
import org.opensaml.saml.saml2.common.TimeBoundSAMLObject;
import org.opensaml.xmlsec.signature.SignableXMLObject;
import org.opensaml.xmlsec.signature.Signature;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.MappedSuperclass;
import javax.persistence.OneToOne;
import java.time.Duration;
import java.time.Instant;
import java.util.List;

@MappedSuperclass
@EqualsAndHashCode(callSuper = true)
@Audited
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
    public Duration getCacheDuration() {
        return Duration.ofMillis(cacheDuration);
    }

    @Override
    public void setCacheDuration(@Nullable final Duration duration) {
        if (duration == null) {
            cacheDuration = 0l;
        } else {
            cacheDuration = duration.toMillis();
        }
    }

    @Override
    public Instant getValidUntil() {
        return Instant.ofEpochMilli(validUntil.getMillis());
    }

    @Override
    public void setValidUntil(Instant validUntilInstant) {
        this.validUntil = new DateTime(validUntilInstant.toEpochMilli());
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