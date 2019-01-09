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
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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
@EqualsAndHashCode(callSuper = true, exclude = "roles")
@ToString(exclude = "roles")
public class User extends AbstractAuditable {

    @Column(nullable = false, unique = true)
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    private String firstName;

    private String lastName;

    private String emailAddress;

    @Transient
    private String role;

    @JsonIgnore
    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

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
}
