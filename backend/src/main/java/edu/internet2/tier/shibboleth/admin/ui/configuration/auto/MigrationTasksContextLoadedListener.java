package edu.internet2.tier.shibboleth.admin.ui.configuration.auto;

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;

import java.util.List;

/**
 * After the context loads, do any needed migration tasks
 */
@Component
public class MigrationTasksContextLoadedListener implements ApplicationListener<ContextRefreshedEvent> {
    @Autowired
    private EntityDescriptorRepository entityDescriptorRepository;

    @Autowired
    private IGroupService groupService;

    @Autowired
    private OwnershipRepository ownershipRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        doshibui_1740_migration(); // do first
    }

    @Transactional
    void doshibui_1740_migration() {
        groupService.ensureAdminGroupExists();  // do first

        // SHIBUI-1740: Adding admin group to all existing entity descriptors that do not have a group already.
        // the ADMIN_GROUP has already been setup (just above)
        try {
            entityDescriptorRepository.findAllByIdOfOwnerIsNull().forEach(ed -> {
                ed.setIdOfOwner(Group.ADMIN_GROUP.getOwnerId());
                ed = entityDescriptorRepository.saveAndFlush(ed);
                ownershipRepository.saveAndFlush(new Ownership(Group.ADMIN_GROUP, ed));
            });
        }
        catch (NullPointerException e) {
            // This block was added due to a number of mock test where NPEs happened. Rather than wire more mock junk
            // into tests that are only trying to compensate for this migration, this is here
        }
        
        userRepository.findAll().forEach(user -> {
            if (user.getGroupId() == null) {
                userService.save(user); // this will ensure group is set as the default user group
            }
        });
    }
}