package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
public class EntityAttributesFilterTarget extends AbstractAuditable {
    public enum EntityAttributesFilterTargetType {
        ENTITY, CONDITION_SCRIPT, CONDITION_REF
    }

    private static Logger LOGGER = LoggerFactory.getLogger(EntityAttributesFilterTarget.class);

    private EntityAttributesFilterTargetType entityAttributesFilterTargetType;

    @ElementCollection
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

    public void setValue(String value) {
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