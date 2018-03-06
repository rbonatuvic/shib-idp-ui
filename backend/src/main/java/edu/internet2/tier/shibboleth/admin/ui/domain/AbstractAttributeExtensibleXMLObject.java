package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.AttributeExtensibleXMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

@MappedSuperclass
public abstract class AbstractAttributeExtensibleXMLObject extends AbstractXMLObject implements AttributeExtensibleXMLObject {

    private transient final AttributeMap unknownAttributes;

    AbstractAttributeExtensibleXMLObject() {
        unknownAttributes = new AttributeMap(this);
    }

    @Nonnull
    @Override
    @Transient
    public AttributeMap getUnknownAttributes() {
        return this.unknownAttributes;
    }
}