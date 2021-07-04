package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.Set;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity(name = "user_groups")
@Data
public class Group {
    @Transient
    @JsonIgnore
    public static Group DEFAULT_GROUP;
    
    @Column(name = "group_description", nullable = true)
    String description;

    @Column(nullable = false)
    String name;

    @Id
    @Column(name = "resource_id")
    String resourceId = UUID.randomUUID().toString();
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    Set<User> users;
    
    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    Set<EntityDescriptor> entityDescriptors;
    
    @Column(name = "default_group", nullable = false)
    boolean defaultGroup = false;
}
