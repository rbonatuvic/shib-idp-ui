package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.Set;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity(name = "user_groups")
@Data
public class Group {
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
}
