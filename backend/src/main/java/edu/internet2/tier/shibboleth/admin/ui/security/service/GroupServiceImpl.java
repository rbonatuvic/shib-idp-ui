package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupRepository;

@Service
public class GroupServiceImpl implements IGroupService {
    @Autowired
    private GroupRepository repo;
    
    @Override
    public Group createOrUpdateGroup(Group group) {
        return repo.save(group);
    }

    @Override
    public void deleteDefinition(Group group) {
        repo.delete(group);
    }

    @Override
    public Group find(String resourceId) {
        return repo.findByResourceId(resourceId);
    }

    @Override
    public List<Group> findAll() {
        return repo.findAll();
    }

}
