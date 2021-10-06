package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.DevConfig;
import edu.internet2.tier.shibboleth.admin.ui.repository.AttributeBundleRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/api/heheheheheheheWipeout")
@Profile("very-dangerous")
@Slf4j
public class DangerController {
    @Autowired
    private AttributeBundleRepository attributeBundleRepository;

    @Autowired
    private DevConfig devConfig;

    @Autowired
    private EntityDescriptorService entityDescriptorService;
    
    @Autowired
    private EntityDescriptorRepository edRepo;
    
    @Autowired
    private FilterRepository filterRepository;
    
    @Autowired
    private IGroupService groupService;

    @Autowired
    private GroupsRepository groupRepository;

    @Autowired
    private MetadataResolverRepository metadataResolverRepository;
    
    @Autowired
    private MetadataResolversPositionOrderContainerRepository metadataResolversPositionOrderContainerRepository;

    @Autowired
    private OwnershipRepository ownershipRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    @GetMapping
    public ResponseEntity<?> wipeOut() {
        edRepo.findAll().forEach(ed -> {
            try {
                ed.setServiceEnabled(false);
                edRepo.save(ed);
                ownershipRepository.deleteEntriesForOwnedObject(ed);
                entityDescriptorService.delete(ed.getResourceId());
            }
            catch (Throwable e) {
                System.out.println("@@@@@@ error deleting" + e.getMessage());
            }
        });
        this.metadataResolverRepository.deleteAll();
        this.filterRepository.deleteAll();
        this.metadataResolversPositionOrderContainerRepository.deleteAll();
        this.attributeBundleRepository.deleteAll();

        clearUsersAndGroups();

        return ResponseEntity.ok("yes, you did it");
    }

    private void clearUsersAndGroups() {
        groupRepository.deleteAll();
        ownershipRepository.clearAllOwnedByGroup();
        userRepository.findAll().forEach(user -> {
            ownershipRepository.deleteEntriesForOwnedObject(user); // Anything that owns the user that wasn't a group?
            // users don't own things yet, so there isn't a method for deleting entries where they would, but may need that someday
            userRepository.delete(user);
        });

        groupService.ensureAdminGroupExists();
        devConfig.createDevUsersAndGroups();
    }
}
