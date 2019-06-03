package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.AttributeExtensibleXMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.persistence.MappedSuperclass;
import javax.persistence.Transient;

@MappedSuperclass
@EqualsAndHashCode(callSuper = true, exclude={"unknownAttributes"})
@Audited
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
