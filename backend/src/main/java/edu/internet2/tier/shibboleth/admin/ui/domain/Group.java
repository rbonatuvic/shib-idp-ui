package edu.internet2.tier.shibboleth.admin.ui.domain;

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
    @Column(name = "resource_id", nullable = false)
    String resourceId = UUID.randomUUID().toString();
}
