package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;

@Service
public class GroupServiceImpl implements IGroupService {
    @Autowired
    private GroupsRepository repo;
    
    @Override
    public Group createGroup(Group group) throws GroupExistsConflictException {
        Group foundGroup = find(group.getResourceId());
        // If already defined, we can't create a new one, nor do we want this call update the definition
        if (foundGroup != null) {
            throw new GroupExistsConflictException(
                            String.format("Call update (PUT) to modify the group with resource id: [%s] and name: [%s]",
                                            foundGroup.getResourceId(), foundGroup.getName()));
        }
        return repo.save(group);
    }

    @Override
    public void deleteDefinition(String resourceId) throws EntityNotFoundException, GroupDeleteException {
        Group g = find(resourceId);
        if (!g.getUsers().isEmpty() || !g.getEntityDescriptors().isEmpty()) {
            throw new GroupDeleteException(String.format(
                            "Unable to delete group with resource id: [%s] - remove all users and entities from group first",
                            resourceId));
        }
        repo.delete(g);
    }

    @Override
    public Group find(String resourceId) {
        return repo.findByResourceId(resourceId);
    }

    @Override
    public List<Group> findAll() {
        return repo.findAll();
    }

    @Override
    public Group updateGroup(Group group) throws EntityNotFoundException {
        Group g = find(group.getResourceId());
        if (g == null) {
            throw new EntityNotFoundException(String.format("Unable to find group with resource id: [%s] and name: [%s]",
                            group.getResourceId(), group.getName()));
        }
        return repo.save(group);
    }

}
