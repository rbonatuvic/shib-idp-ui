package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import lombok.NoArgsConstructor;

@Service
@NoArgsConstructor
public class GroupServiceImpl implements IGroupService {
    @Autowired
    protected GroupsRepository groupRepository;
    
    @Autowired
    protected OwnershipRepository ownershipRepository;
    
    public GroupServiceImpl(GroupsRepository repo, OwnershipRepository ownershipRepository) {
        this.groupRepository = repo;
        this.ownershipRepository = ownershipRepository;
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
        return groupRepository.save(group);
    }

    @Override
    @Transactional
    public void deleteDefinition(String resourceId) throws EntityNotFoundException, GroupDeleteException {
        Group group = find(resourceId);
        if (!ownershipRepository.findAllByOwner(group).isEmpty()) {
            throw new GroupDeleteException(String.format(
                            "Unable to delete group with resource id: [%s] - remove all items owned by / associated with the group first",
                            resourceId));
        }
        groupRepository.delete(group);
    }

    @Override
    @Transactional
    public void ensureAdminGroupExists() {
        Group g = groupRepository.findByResourceId("admingroup");
        if (g == null) {
            g = new Group();
            g.setName("ADMIN-GROUP");
            g.setResourceId("admingroup");
            g = groupRepository.save(g);
        }
        Group.ADMIN_GROUP = g;
    }

    @Override
    @Transactional
    public Group find(String resourceId) {
        return groupRepository.findByResourceId(resourceId);
    }

    @Override
    public List<Group> findAll() {
        return groupRepository.findAll();
    }

    @Override
    public Group updateGroup(Group group) throws EntityNotFoundException {
        Group g = find(group.getResourceId());
        if (g == null) {
            throw new EntityNotFoundException(String.format("Unable to find group with resource id: [%s] and name: [%s]",
                            group.getResourceId(), group.getName()));
        }
        return groupRepository.save(group);
    }
}