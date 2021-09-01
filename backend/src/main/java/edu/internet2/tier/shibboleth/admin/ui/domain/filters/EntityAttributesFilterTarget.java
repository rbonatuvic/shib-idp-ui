package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class EntityAttributesFilterTarget extends AbstractAuditable implements IFilterTarget {

    private EntityAttributesFilterTargetType entityAttributesFilterTargetType;

    @ElementCollection (fetch = FetchType.EAGER)
    @OrderColumn
    @Column(length = 760)
    private List<String> value;

    public EntityAttributesFilterTargetType getEntityAttributesFilterTargetType() {
        return entityAttributesFilterTargetType;
    }

    @Override
    @JsonIgnore
    public String getTargetTypeValue() {
        return entityAttributesFilterTargetType == null ? "NONE" : entityAttributesFilterTargetType.name();
    }

    @Override
    public List<String> getValue() {
        return value == null ? new ArrayList<>() : value;
    }

    public void setEntityAttributesFilterTargetType(EntityAttributesFilterTargetType entityAttributesFilterTarget) {
        this.entityAttributesFilterTargetType = entityAttributesFilterTarget;
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

    public enum EntityAttributesFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF, REGEX
    }
}