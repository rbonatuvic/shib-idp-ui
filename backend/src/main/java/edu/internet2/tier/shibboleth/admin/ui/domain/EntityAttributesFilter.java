package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.base.Predicate;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class EntityAttributesFilter extends MetadataFilter {
    @OneToOne(cascade = CascadeType.ALL)
    private EntityAttributesFilterTarget entityAttributesFilterTarget;

    @OneToMany(cascade = CascadeType.ALL)
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
