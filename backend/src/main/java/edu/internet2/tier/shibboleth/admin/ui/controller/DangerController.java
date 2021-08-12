package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping(value = "/api/heheheheheheheWipeout")
@Profile("very-dangerous")
@Slf4j
public class DangerController {
    @Autowired
    private EntityDescriptorService entityDescriptorService;
    
    @Autowired
    private EntityDescriptorRepository edRepo;
    
    @Autowired
    private FilterRepository filterRepository;
    
    @Autowired
    private IGroupService groupService;
    
    @Autowired
    private MetadataResolverRepository metadataResolverRepository;
    
    @Autowired
    private MetadataResolversPositionOrderContainerRepository metadataResolversPositionOrderContainerRepository;

    @Autowired
    private OwnershipRepository ownershipRepository;
    
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
        return ResponseEntity.ok("yes, you did it");
    }
}
