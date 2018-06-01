package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
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
@NoArgsConstructor
@Getter
@Setter
@ToString
public class EntityRoleWhiteListFilter extends MetadataFilter {

    @JsonProperty("@type")
    private final transient String type = "EntityRoleWhiteList";

    private Boolean removeRolelessEntityDescriptors = true;

    private Boolean removeEmptyEntitiesDescriptors = true;

    @ElementCollection
    @CollectionTable(name="RETAINED_ROLES", joinColumns=@JoinColumn(name="ENTITY_ROLE_WHITELIST_FILTER_ID"))
    @Column(name="RETAINED_ROLE")
    private List<String> retainedRoles = new ArrayList<>();
}
