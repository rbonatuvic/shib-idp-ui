package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/api/heheheheheheheWipeout")
@Profile("very-dangerous")
public class DangerController {
    private final MetadataResolverRepository metadataResolverRepository;
    private final EntityDescriptorRepository entityDescriptorRepository;
    private final FilterRepository filterRepository;
    private final MetadataResolversPositionOrderContainerRepository metadataResolversPositionOrderContainerRepository;

    public DangerController(final MetadataResolverRepository metadataResolverRepository, final EntityDescriptorRepository entityDescriptorRepository, final FilterRepository filterRepository, final MetadataResolversPositionOrderContainerRepository metadataResolversPositionOrderContainerRepository) {
        this.metadataResolverRepository = metadataResolverRepository;
        this.entityDescriptorRepository = entityDescriptorRepository;
        this.filterRepository = filterRepository;
        this.metadataResolversPositionOrderContainerRepository = metadataResolversPositionOrderContainerRepository;
    }

    @Transactional
    @GetMapping
    public ResponseEntity<?> wipeOut() {
        this.entityDescriptorRepository.deleteAll();
        this.metadataResolverRepository.deleteAll();
        this.filterRepository.deleteAll();
        this.metadataResolversPositionOrderContainerRepository.deleteAll();
        return ResponseEntity.ok("yes, you did it");
    }
}
