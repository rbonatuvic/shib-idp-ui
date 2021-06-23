package edu.internet2.tier.shibboleth.admin.ui.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.domain.Group;

public interface GroupRepository extends JpaRepository<Group, String> {
    List<Group> findAll();
    
    Group findByResourceId(String id);
    
    @SuppressWarnings("unchecked")
    Group save(Group group);
}
