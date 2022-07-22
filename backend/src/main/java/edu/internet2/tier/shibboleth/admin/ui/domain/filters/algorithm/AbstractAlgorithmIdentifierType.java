package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public abstract class AbstractAlgorithmIdentifierType extends AbstractXMLObject {
    private String algorithm;
}