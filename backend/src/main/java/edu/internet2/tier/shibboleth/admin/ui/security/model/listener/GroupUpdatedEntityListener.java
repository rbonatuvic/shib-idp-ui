package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import java.util.List;
import java.util.Set;

public class GroupUpdatedEntityListener implements ILazyLoaderHelper {
    private static GroupsRepository groupsRepository;
    private static OwnershipRepository ownershipRepository;

    /**
     * @see https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
     */
    @Autowired
    public static void init(OwnershipRepository ownershipRepository, GroupsRepository groupsRepository) {
        GroupUpdatedEntityListener.ownershipRepository = ownershipRepository;
        GroupUpdatedEntityListener.groupsRepository = groupsRepository;
    }

    @PostPersist
    @PostUpdate
    @PostLoad
    @PostRemove
    public synchronized void groupSavedOrFetched(Group group) {
        // Because of the JPA spec, the listener can't do queries in the callback, so we force lazy loading through
        // another callback to this at the time that the owned items are needed
        group.registerLoader(this);
    }

    @Override
    public void loadOwnedItems(Group group) {
      Set<Ownership> ownedItems = ownershipRepository.findAllByOwner(group);
      group.setOwnedItems(ownedItems);
    }

    @Override
    public void loadApproveForList(Group group) {
        List<String> result = group.getResourceId().equals(Group.ADMIN_GROUP.getResourceId()) ?
                        groupsRepository.findAllGroupIds() :
                        groupsRepository.getGroupIdsOfGroupsToApproveFor(group.getResourceId());
        if (result != null) {
            group.setApproveForList(result);
        }
    }

}