package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.HashMap;
import java.util.Map;

/**
 * Since Java doesn't support multiple inheritance, this is based on a copy of previously written code - AbstractAttributeExtensibleXMLObject
 */
@Entity
@EqualsAndHashCode(callSuper = true)
public class AttributeValue extends AbstractElementExtensibleXMLObject implements org.opensaml.saml.saml2.core.AttributeValue {
    private transient final AttributeMap unknownAttributes = new AttributeMap(this);
    private String textContent;
    @ElementCollection private Map<QName, String> storageAttributeMap = new HashMap<>();

    @Nullable
    @Override
    public String getTextContent() {
        return null;
    }

    @Override
    public void setTextContent(@Nullable String newContent) {
        this.textContent = newContent;
    }

    @Nonnull
    @Override
    @Transient
    public AttributeMap getUnknownAttributes() {
        return this.unknownAttributes;
    }

    @PrePersist
    void prePersist() {
        this.storageAttributeMap = this.unknownAttributes;
    }

    @PostLoad
    void postLoad() {
        this.unknownAttributes.putAll(this.storageAttributeMap);
    }
}