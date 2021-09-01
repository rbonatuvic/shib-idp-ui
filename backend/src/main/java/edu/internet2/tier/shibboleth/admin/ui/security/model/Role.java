package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Models a basic administrative role concept in the system.
 *
 * @author Dmitriy Kopylenko
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = "users")
@ToString(exclude = "users")
public class Role extends AbstractAuditable {

    @Column(unique = true)
    private String name;

    @Column(name = "ROLE_RANK")
    private int rank; // 0=ADMIN, additional ranks are higher

    @Column(name = "resource_id")
    String resourceId = UUID.randomUUID().toString();

    //Ignore properties annotation here is to prevent stack overflow recursive error during JSON serialization
    @JsonIgnoreProperties("roles")
    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    public Role(String name) {
        this.name = name;
    }
    
    public Role(String name, int rank) {
        this.name = name;
        this.rank = rank;
    }

}
