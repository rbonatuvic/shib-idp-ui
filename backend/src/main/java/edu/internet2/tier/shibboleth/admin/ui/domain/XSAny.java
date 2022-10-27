package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Type;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Transient;

@Entity
@EqualsAndHashCode(callSuper = true, exclude = {"unknownAttributes"})
@Audited
public class XSAny extends AbstractElementExtensibleXMLObject implements org.opensaml.core.xml.schema.XSAny {
    @Lob
    @Type(type = "org.hibernate.type.TextType")
    private String textContext;

    //TODO: implement. this at the underlying level is a just a Map<QName,String>
    @Transient
    private AttributeMap unknownAttributes;

    protected XSAny() {
        this.unknownAttributes = new AttributeMap(this);
    }

    @Nullable
    @Override
    public String getTextContent() {
        return this.textContext;
    }

    @Override
    public void setTextContent(@Nullable String newContent) {
        this.textContext = newContent;
    }

    @Nonnull
    @Override
    public AttributeMap getUnknownAttributes() {
        return this.unknownAttributes;
    }
}