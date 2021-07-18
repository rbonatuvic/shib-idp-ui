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
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
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

    @ManyToOne
    @JoinColumn(name = "group_resource_id")
    @EqualsAndHashCode.Exclude
    private Group group;
    
    @Transient
    @EqualsAndHashCode.Exclude
    private String groupId; // simplifies the ui/api
    
    private String lastName;

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

    @Column(nullable = false, unique = true)
    private String username;

    public Group getGroup() {
        return group;
    }
    
    public String getGroupId() {
        if (groupId == null) {
            groupId = group == null ? null : getGroup().getResourceId();
        }
        return groupId;
    }
    
    public String getRole() {
        if (StringUtils.isBlank(this.role)) {
            Set<Role> roles = this.getRoles();
            if (roles.size() != 1) {
                throw new RuntimeException(String.format("User with username [%s] does not have exactly one role!", this.getUsername()));
            }
            this.role = roles.iterator().next().getName();
        }
        return this.role;
    }
    
    /**
     * If (for some reason) the incoming group is null, the user is defaulted to their own group
     */
    public void setGroup(Group assignedGroup) {
        this.group = assignedGroup;
        this.groupId = getGroup().getResourceId();
    }
}
