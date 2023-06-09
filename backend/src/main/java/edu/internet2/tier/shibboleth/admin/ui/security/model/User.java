package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.ILazyLoaderHelper;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.apache.commons.lang.StringUtils;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.util.HashSet;
import java.util.Set;

/**
 * Models a basic administrative user in the system.
 *
 * @author Dmitriy Kopylenko
 */
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(exclude = "roles")
@EntityListeners(UserUpdatedEntityListener.class)
@Entity
@Table(name = "USERS")
public class User extends AbstractAuditable implements Owner, Ownable {
    private String emailAddress;

    private String firstName;
    
    @Transient
    @EqualsAndHashCode.Exclude
    private String groupId; // simplifies the ui/api
       
    private String lastName;
    
    @Transient
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    private ILazyLoaderHelper lazyLoaderHelper;
    
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

    @EqualsAndHashCode.Exclude
    @Transient
    private Set<Group> userGroups = new HashSet<>();
    
    @Column(nullable = false, unique = true)
    private String username;
    
    /**
     * @return the initial implementation, while supporting a user having multiple groups in the db side, acts as if the
     * user can only belong to a single group
     */
    public Group getGroup() {
        return getUserGroups().isEmpty() ? null : (Group) userGroups.toArray()[0];
    }
        
    public String getGroupId() {
        if (getRole().equals("ROLE_ADMIN")) {
            groupId = Group.ADMIN_GROUP.getResourceId();
        }
        if (groupId == null) {
            groupId = getUserGroups().isEmpty() ? null : getGroup().getResourceId();
        }
        return groupId;
    }
    
    @Override
    public String getObjectId() {
        return username;
    }

    @Override
    public OwnableType getOwnableType() {
        return OwnableType.USER;
    }
    
    @Override
    public String getOwnerId() {
        return username;
    }
    
    @Override
    public OwnerType getOwnerType() {
        return OwnerType.USER;
    }

    /**
     * @return the FIRST role found for the user or an exception if the user has no roles
     */
    public String getRole() {
        if (StringUtils.isBlank(this.role)) {
            Set<Role> roles = this.getRoles();
            if (roles.isEmpty()) {
                throw new RuntimeException(String.format("User with username [%s] has no roles", this.getUsername()));
            }
            this.role = roles.iterator().next().getName();
        }
        return this.role;
    }

    public Set<Group> getUserGroups() {
        if (lazyLoaderHelper != null) {
            lazyLoaderHelper.loadGroups(this);
        }
        return userGroups;
    }

    @JsonIgnore
    public void setGroup(Group g) {
        groupId = g.getResourceId();
        userGroups.clear();
        userGroups.add(g);
    }

    public void setGroups(Set<Group> groups) {
        this.userGroups = groups;
    }

    public void registerLoader(ILazyLoaderHelper lazyLoaderHelper) {
        this.lazyLoaderHelper = lazyLoaderHelper;
    }

    /**
     * @return true if the user belongs to any group that can approve for other groups
     */
    public boolean getCanApprove() {
        if (Group.ADMIN_GROUP.equals(getGroup())) {
            return true;
        }
        for (Group group : getUserGroups()) {
            if (!group.getApproveForList().isEmpty()) {
                return true;
            }
        }
        return false;
    }
}