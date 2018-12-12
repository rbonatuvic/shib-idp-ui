package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.*;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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

    private String name;

    private String emailAddress;

    //Ignore properties annotation here is to prevent stack overflow recursive error during JSON serialization
    @JsonIgnoreProperties("users")
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}
