package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.AttributeExtensibleXMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.ElementCollection;
import javax.persistence.MappedSuperclass;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.HashMap;
import java.util.Map;

@MappedSuperclass
@EqualsAndHashCode(callSuper = true, exclude={"storageAttributeMap"})
public abstract class AbstractAttributeExtensibleXMLObject extends AbstractXMLObject implements AttributeExtensibleXMLObject {
    private transient final AttributeMap unknownAttributes = new AttributeMap(this);

    AbstractAttributeExtensibleXMLObject() {
    }

    @Nonnull
    @Override
    @Transient
    public AttributeMap getUnknownAttributes() {
        return this.unknownAttributes;
    }

    @ElementCollection
    private Map<QName,String> storageAttributeMap = new HashMap<>();

    @PrePersist
    void prePersist() {
        this.storageAttributeMap = this.unknownAttributes;
    }

    @PostLoad
    void postLoad() {
        this.unknownAttributes.putAll(this.storageAttributeMap);
    }
}