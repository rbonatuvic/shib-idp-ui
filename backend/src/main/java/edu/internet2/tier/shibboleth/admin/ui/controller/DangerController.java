package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;

@Controller
@RequestMapping(value = "/api/heheheheheheheWipeout")
@Profile("very-dangerous")
public class DangerController {
    @Autowired
    private EntityDescriptorService entityDescriptorService;
    
    @Autowired
    private EntityDescriptorRepository edRepo;
    
    @Autowired
    private FilterRepository filterRepository;
    
    @Autowired
    private MetadataResolverRepository metadataResolverRepository;
    
    @Autowired
    private MetadataResolversPositionOrderContainerRepository metadataResolversPositionOrderContainerRepository;

    @Transactional
    @GetMapping
    public ResponseEntity<?> wipeOut() throws ForbiddenException {
        edRepo.findAll().forEach(ed -> {
            try {
                ed.setServiceEnabled(false);
                edRepo.save(ed);
                entityDescriptorService.delete(ed.getResourceId());
            }
            catch (Throwable e) {
            }
        });
        
        this.metadataResolverRepository.deleteAll();
        this.filterRepository.deleteAll();
        this.metadataResolversPositionOrderContainerRepository.deleteAll();
        return ResponseEntity.ok("yes, you did it");
    }
}
