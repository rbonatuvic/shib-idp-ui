package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;
import org.opensaml.xmlsec.encryption.support.EncryptionConstants;

import javax.persistence.Entity;

@Entity
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class PRF extends AbstractAlgorithmIdentifierType {
    public PRF() {
        setElementLocalName("PRF");
        setNamespaceURI(EncryptionConstants.XMLENC11_NS);
        setNamespacePrefix(EncryptionConstants.XMLENC11_PREFIX);
    }
}