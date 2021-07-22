package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.UserGroup;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserGroupRepository;

@Service
public class GroupServiceImpl implements IGroupService, InitializingBean {
    @Autowired
    private GroupsRepository repo;
    
    @Autowired
    private UserGroupRepository userGroupRepo;
    
    public GroupServiceImpl() {        
    }
    
    public GroupServiceImpl(GroupsRepository repo) {
        this.repo = repo;
    }
    
    @Override
    public void clearAllForTesting() {
        repo.deleteAll();
        afterPropertiesSet();
    }
    
    @Override
    @Transactional
    public Group createGroup(Group group) throws GroupExistsConflictException {
        Group foundGroup = find(group.getResourceId());
        // If already defined, we don't want to create a new one, nor do we want this call update the definition
        if (foundGroup != null) {
            throw new GroupExistsConflictException(
                            String.format("Call update (PUT) to modify the group with resource id: [%s] and name: [%s]",
                                            foundGroup.getResourceId(), foundGroup.getName()));
        }
        return repo.save(group);
    }

    @Override
    @Transactional
    public void deleteDefinition(String resourceId) throws EntityNotFoundException, GroupDeleteException {
        Group g = find(resourceId);
        Optional<List<UserGroup>> userGroups = userGroupRepo.findAllByGroup(g);
        if (userGroups.isEmpty() || !g.getEntityDescriptors().isEmpty()) {
            throw new GroupDeleteException(String.format(
                            "Unable to delete group with resource id: [%s] - remove all users and entities from group first",
                            resourceId));
        }
        repo.delete(g);
    }

    @Override
    @Transactional
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

    /**
     * Ensure (mostly for migrations) that we have defined a default admin group
     */
    @Override
    @Transactional
    public void afterPropertiesSet() {
        Group g = repo.findByResourceId("admingroup");
        if (g == null) {
            g = new Group();
            g.setName("ADMIN-GROUP");
            g.setResourceId("admingroup");
            g = repo.save(g);
        }
        Group.ADMIN_GROUP = g;
    }
}
