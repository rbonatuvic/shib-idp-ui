package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Audited
public class DefaultAcrValue extends AbstractValueXMLObject implements net.shibboleth.oidc.saml.xmlobject.DefaultAcrValue {
    public DefaultAcrValue(String value) {
        this.setValue(value);
    }
}