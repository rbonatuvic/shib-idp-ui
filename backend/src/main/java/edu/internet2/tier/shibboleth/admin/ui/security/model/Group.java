package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity(name = "user_groups")
@Data
public class Group {
    @Transient
    @JsonIgnore
    public static Group ADMIN_GROUP;
    
    @Column(name = "group_description", nullable = true)
    String description;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    Set<EntityDescriptor> entityDescriptors = new HashSet<>();
    
    @Column(nullable = false)
    String name;

    @Id
    @Column(name = "resource_id")
    String resourceId = UUID.randomUUID().toString();

    @OneToMany(mappedBy = "group", fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<UserGroup> userGroups = new HashSet<>();
    
    public Group() {
    }
    
    public Group(User user) {
        resourceId = user.getUsername();
        name = user.getUsername();
        description = "default user-group";
    }    

    public void addUser(User user) {
        if (userGroups == null) {
            userGroups = new HashSet<>();
        }
        userGroups.add(new UserGroup(this, user));
    }
        
    public Set<UserGroup> getUserGroups() {
        if (userGroups == null) {
            userGroups = new HashSet<>();
        }
        return userGroups;
    }
}
