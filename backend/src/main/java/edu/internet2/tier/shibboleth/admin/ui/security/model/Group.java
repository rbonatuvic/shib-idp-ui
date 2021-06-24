package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.envers.Audited;

import lombok.Data;

@Entity(name = "user_groups")
@Audited
@Data
public class Group {
    @Column(name = "group_description", nullable = true)
    String description;

    @Column(nullable = false)
    String name;

    @Id
    @Column(name = "resource_id")
    String resourceId = UUID.randomUUID().toString();
}
