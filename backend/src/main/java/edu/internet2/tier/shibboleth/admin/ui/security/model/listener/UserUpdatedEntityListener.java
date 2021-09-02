package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostRemove;
import javax.persistence.PostUpdate;
import java.util.HashSet;
import java.util.Set;

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
    @PostRemove
    public synchronized void userSavedOrFetched(User user) {
        // Because of the JPA spec, the listener can't do queries in the callback, so we force lazy loading through
        // another callback to this at the time that the groups are needed
        user.registerLoader(this);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void loadGroups(User user) {
        Set<Ownership> ownerships = ownershipRepository.findAllGroupsForUser(user.getUsername());
        HashSet<Group> groups = new HashSet<>();
        final boolean isAdmin = user.getRole().equals("ROLE_ADMIN");
        ownerships.stream().map(ownership -> groupRepository.findByResourceId(ownership.getOwnerId())).forEach(userGroup -> {
            if (isAdmin) {
                userGroup.setValidationRegex(null);
            }
            groups.add(userGroup);
        });
        user.setGroups(groups);
        user.setLazyLoaderHelper(null);
    }
}