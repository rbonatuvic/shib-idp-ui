package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import java.util.ArrayList;
import java.util.List;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class EntityRoleWhiteListFilter extends MetadataFilter {

    public EntityRoleWhiteListFilter() {
        type = "EntityRoleWhiteList";
    }

    private Boolean removeRolelessEntityDescriptors = true;

    private Boolean removeEmptyEntitiesDescriptors = true;

    @ElementCollection
    @CollectionTable(name="RETAINED_ROLES", joinColumns=@JoinColumn(name="ENTITY_ROLE_WHITELIST_FILTER_ID"))
    @Column(name="RETAINED_ROLE")
    private List<String> retainedRoles = new ArrayList<>();
}
