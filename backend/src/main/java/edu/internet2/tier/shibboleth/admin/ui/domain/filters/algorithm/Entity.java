package edu.internet2.tier.shibboleth.admin.ui.domain.filters.algorithm;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractXMLObject;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.annotation.Nullable;

@javax.persistence.Entity
@Audited
@Getter
@Setter
@ToString
@EqualsAndHashCode(callSuper = true)
public class Entity extends AbstractXMLObject implements org.opensaml.core.xml.schema.XSString {
    private String uri;

    public Entity(){
        setElementLocalName("Entity");
    }

    @Nullable
    @Override
    public String getValue() {
        return this.uri;
    }

    @Override
    public void setValue(@Nullable String newValue) {
        this.uri = newValue;
    }
}