package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@ToString
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
@JsonIgnoreProperties({"handler", "hibernateLazyInitializer"})
public class EntityAttributesFilterTarget extends AbstractFilterTarget {
    private EntityAttributesFilterTargetType entityAttributesFilterTargetType;

    public EntityAttributesFilterTargetType getEntityAttributesFilterTargetType() {
        return entityAttributesFilterTargetType;
    }

    @Override
    @JsonIgnore
    public String getTargetTypeValue() {
        return entityAttributesFilterTargetType == null ? "NONE" : entityAttributesFilterTargetType.name();
    }

    public void setEntityAttributesFilterTargetType(EntityAttributesFilterTargetType entityAttributesFilterTarget) {
        this.entityAttributesFilterTargetType = entityAttributesFilterTarget;
    }

    public enum EntityAttributesFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF, REGEX
    }
}