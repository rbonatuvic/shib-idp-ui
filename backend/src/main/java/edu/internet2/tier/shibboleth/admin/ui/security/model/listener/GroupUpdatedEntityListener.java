package edu.internet2.tier.shibboleth.admin.ui.security.model.listener;

import java.util.Set;

import javax.persistence.PostLoad;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

import org.springframework.beans.factory.annotation.Autowired;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;

public class GroupUpdatedEntityListener implements ILazyLoaderHelper {
    private static OwnershipRepository ownershipRepository;

    /**
     * @see https://stackoverflow.com/questions/12155632/injecting-a-spring-dependency-into-a-jpa-entitylistener
     */
    @Autowired
    public void init(OwnershipRepository repo) {
        GroupUpdatedEntityListener.ownershipRepository = repo;
    }

    @PostPersist
    @PostUpdate
    @PostLoad
    public synchronized void groupSavedOrFetched(Group group) {
        // Because of the JPA spec, the listener can't do queries in the callback, so we force lazy loading through
        // another callback to this at the time that the owned items are needed
        group.registerLoader(this);
    }

    @Override
    public void loadOwnedItems(Group group) {
      group.registerLoader(null); // once loaded, remove the helper from the group
      Set<Ownership> ownedItems = ownershipRepository.findAllByOwner(group);
      group.setOwnedItems(ownedItems);        
    }

}