package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.internet2.tier.shibboleth.admin.ui.controller.FilterController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Entity
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
