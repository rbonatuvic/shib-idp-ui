package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
public class EntityAttributesFilter extends MetadataFilter {
    @OneToOne(cascade = CascadeType.ALL)
    private EntityAttributesFilterTarget entityAttributesFilterTarget;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<Attribute> attributes = new ArrayList<>();

    public EntityAttributesFilterTarget getEntityAttributesFilterTarget() {
        return entityAttributesFilterTarget;
    }

    public void setEntityAttributesFilterTarget(EntityAttributesFilterTarget entityAttributesFilterTarget) {
        this.entityAttributesFilterTarget = entityAttributesFilterTarget;
    }

    public List<Attribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String toString() {
        return "EntityAttributesFilter{" +
                "entityAttributesFilterTarget=" + entityAttributesFilterTarget +
                "\n, attributes=" + attributes +
                "\n}";
    }
}
