package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.xmlsec.encryption.AlgorithmIdentifierType;

import javax.annotation.Nullable;
import javax.persistence.Entity;

@Entity
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public abstract class AbstractAlgorithmIdentifierType extends AbstractXMLObject implements AlgorithmIdentifierType {
    private String algorithm;

    @Nullable
    @Override
    public XMLObject getParameters() {
        // implement?
        return null;
    }

    @Override
    public void setParameters(@Nullable final XMLObject newParameters) {
        // do nothing?
    }

}