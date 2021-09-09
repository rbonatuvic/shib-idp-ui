package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

public interface GroupsRepository extends JpaRepository<Group, String> {
    void deleteByResourceId(String resourceId);

    Group findByResourceId(String id);
}