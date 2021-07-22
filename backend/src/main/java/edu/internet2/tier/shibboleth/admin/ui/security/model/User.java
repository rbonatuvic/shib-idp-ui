package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang.StringUtils;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.HashSet;
import java.util.Set;

/**
 * Models a basic administrative user in the system.
 *
 * @author Dmitriy Kopylenko
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = "roles")
@Table(name = "USERS")
public class User extends AbstractAuditable {
    private String emailAddress;

    private String firstName;
    
    @Transient
    @EqualsAndHashCode.Exclude
    private String groupId; // simplifies the ui/api
       
    private String lastName;

    @Transient
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private Set<UserGroup> oldUserGroups = new HashSet<>();
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    @Transient
    @EqualsAndHashCode.Exclude
    private String role;

    @JsonIgnore
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    @EqualsAndHashCode.Exclude
    private Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @EqualsAndHashCode.Exclude
    private Set<UserGroup> userGroups = new HashSet<>();
    
    @Column(nullable = false, unique = true)
    private String username;

    public void clearOldUserGroups() {
        oldUserGroups.clear();
    }
    
    /**
     * @return the initial implementation, while supporting a user having multiple groups in the db side, acts as if the
     * user can only belong to a single group
     */
    public Group getGroup() {
        
        return userGroups.isEmpty() ? null : ((UserGroup)userGroups.toArray()[0]).getGroup();
    }
        
    public String getGroupId() {
        if (groupId == null) {
            groupId = userGroups.isEmpty() ? null : getGroup().getResourceId();
        }
        return groupId;
    }
    
    public String getRole() {
        if (StringUtils.isBlank(this.role)) {
            Set<Role> roles = this.getRoles();
            if (roles.size() != 1) {
                throw new RuntimeException(String.format("User with username [%s] has no role or does not have exactly one role!", this.getUsername()));
            }
            this.role = roles.iterator().next().getName();
        }
        return this.role;
    }

    public Set<UserGroup> getUserGroups() {
        if (userGroups == null) {
            userGroups = new HashSet<>();
        }
        return userGroups;
    }
    
    /**
     * If we change groups, we have to manually manage the set of UserGroups so that we don't have group associations 
     * we didn't intend (thanks JPA!!). 
     */
    public void setGroup(Group assignedGroup) {
        // if the incoming group is the current group, make no changes to our sets
        if (assignedGroup.getResourceId().equals(groupId)) {
            userGroups.forEach(ug -> {
                if (ug.getGroup().getResourceId().equals(groupId)) {
                    ug.setGroup(assignedGroup);
                }
            });
            return;
        }

        // stash the current groups for removal
        getUserGroups().forEach(g -> {
            // If the assignedGroup is in the current list, don't bother putting it in the "delete" list
            if (!g.getGroup().equals(assignedGroup)) {
                oldUserGroups.add(g);
            }
        });
        userGroups.clear();

        // Assign the new group
        UserGroup ug = new UserGroup(assignedGroup, this);
        userGroups.add(ug);

        // Set reference for the UI
        groupId = assignedGroup.getResourceId();
    }
    
    public void setGroups(Set<Group> groups) {
        oldUserGroups.addAll(getUserGroups());
        getUserGroups().clear();
        groups.forEach(g -> userGroups.add(new UserGroup(g, this)));
    }
}
