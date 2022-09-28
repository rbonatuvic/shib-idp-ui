package edu.internet2.tier.shibboleth.admin.ui.domain.oidc;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import lombok.EqualsAndHashCode;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@Audited
@AuditOverride(forClass = AbstractXMLObject.class)
public abstract class AbstractValueXMLObject extends AbstractXMLObject implements ValueXMLObject {
    private String stringValue;

    @Nullable
    public String getValue() {
        return this.stringValue;
    }

    public void setValue(@Nullable String newValue) {
        this.stringValue = newValue;
    }

    @Override
    public int hashCode() {
        return getValue() == null ? 0 : getValue().hashCode();
    }

    @Override
    public boolean equals(Object o) {
        return o.getClass().equals(this.getClass()) && StringUtils.equals(this.stringValue, ((AbstractValueXMLObject)o).stringValue);
    }
}