package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;

public class UserUpdatedEntityListener implements ILazyLoaderHelper {
    private static GroupsRepository groupRepository;
    private static OwnershipRepository ownershipRepository;

    /**
     * @see https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
     */
    @Autowired
    public void init(OwnershipRepository repo, GroupsRepository groupRepo) {
        UserUpdatedEntityListener.ownershipRepository = repo;
        UserUpdatedEntityListener.groupRepository = groupRepo;
    }

    @PostPersist
    @PostUpdate
    @PostLoad
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public synchronized void userSavedOrFetched(User user) {
        // Because of the JPA spec, the listener can't do queries in the callback, so we force lazy loading through
        // another callback to this at the time that the groups are needed
        user.registerLoader(this);
    }
    
    public void loadGroups(User user) {
        user.setLazyLoaderHelper(null);
        Set<Ownership> ownerships = ownershipRepository.findAllGroupsForUser(user.getUsername());
        HashSet<Group> groups = new HashSet<>();
        ownerships.forEach(ownership -> {
            groups.add(groupRepository.findByResourceId(ownership.getOwnerId()));
        });
        user.setGroups(groups);
    }
}