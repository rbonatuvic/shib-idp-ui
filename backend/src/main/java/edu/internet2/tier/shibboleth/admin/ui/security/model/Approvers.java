package edu.internet2.tier.shibboleth.admin.ui.security.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity(name = "approvers")
public class Approvers {
    @Id
    @Column(name = "resource_id")
    private String resourceId = UUID.randomUUID().toString();

    @OneToMany
    private List<Group> approverGroups = new ArrayList<>();
}