package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

public interface GroupsRepository extends JpaRepository<Group, String> {
    List<Group> findAll();
    
    Group findByResourceId(String id);
    
    @SuppressWarnings("unchecked")
    Group save(Group group);
}
