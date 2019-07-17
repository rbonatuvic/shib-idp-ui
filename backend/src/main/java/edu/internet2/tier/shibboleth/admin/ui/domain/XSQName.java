package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import net.shibboleth.utilities.java.support.xml.QNameSupport;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.xml.namespace.QName;
import java.beans.Transient;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class XSQName extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSQName {
    @Nullable
    @Override
    @Transient
    public QName getValue() {
        return QNameSupport.constructQName(this.getNamespaceURI(), this.getElementLocalName(), this.getNamespacePrefix());
    }

    @Override
    public void setValue(@Nullable QName newValue) {
        this.setNamespaceURI(newValue.getNamespaceURI());
        this.setElementLocalName(newValue.getLocalPart());
        this.setNamespacePrefix(newValue.getPrefix());
    }
}
