package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import java.util.HashSet;
import java.util.Set;

/**
 * Models a basic administrative role concept in the system.
 *
 * @author Dmitriy Kopylenko
 */
@Entity
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true, exclude = "admins")
@ToString(exclude = "admins")
public class AdminRole extends AbstractAuditable {

    @Column(unique = true)
    private String name;

    @ManyToMany(cascade = CascadeType.PERSIST, mappedBy = "roles", fetch = FetchType.EAGER)
    private Set<AdminUser> admins = new HashSet<>();

}
