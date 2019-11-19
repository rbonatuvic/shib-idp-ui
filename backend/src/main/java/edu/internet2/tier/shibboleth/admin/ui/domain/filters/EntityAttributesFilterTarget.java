package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class EntityAttributesFilterTarget extends AbstractAuditable {
    public enum EntityAttributesFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF, REGEX
    }

    private static Logger LOGGER = LoggerFactory.getLogger(EntityAttributesFilterTarget.class);

    private EntityAttributesFilterTargetType entityAttributesFilterTargetType;

    @ElementCollection
    @OrderColumn
    @Column(length = 4000)
    private List<String> value;

    public EntityAttributesFilterTargetType getEntityAttributesFilterTargetType() {
        return entityAttributesFilterTargetType;
    }

    public void setEntityAttributesFilterTargetType(EntityAttributesFilterTargetType entityAttributesFilterTarget) {
        this.entityAttributesFilterTargetType = entityAttributesFilterTarget;
    }

    public List<String> getValue() {
        return value;
    }

    public void setSingleValue(String value) {
        List<String> values = new ArrayList<>();
        values.add(value);
        this.value = values;
    }

    public void setValue(List<String> value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "EntityAttributesFilterTarget{" +
                "entityAttributesFilterTargetType=" + entityAttributesFilterTargetType +
                ", value=" + value +
                '}';
    }
}
