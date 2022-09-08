package edu.internet2.tier.shibboleth.admin.ui.controller;

import javax.script.ScriptException;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.internet2.tier.shibboleth.admin.ui.domain.exceptions.MetadataFileNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InitializationException;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;

@RestController
@RequestMapping("/api/activate")
@Tags(value = {@Tag(name = "activate")})
public class ActivateController {

    @Autowired
    private EntityDescriptorService entityDescriptorService;
    
    @Autowired
    private FilterService filterService;
    
    @Autowired
    private MetadataResolverService metadataResolverService;
    
    @PatchMapping(path = "/entityDescriptor/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> enableEntityDescriptor(@PathVariable String resourceId, @PathVariable String mode) throws
                    PersistentEntityNotFound, ForbiddenException {
        boolean status = "enable".equalsIgnoreCase(mode);
        EntityDescriptorRepresentation edr = entityDescriptorService.updateEntityDescriptorEnabledStatus(resourceId, status);
        return ResponseEntity.ok(edr);
    }
    
    @PatchMapping(path = "/MetadataResolvers/{metadataResolverId}/Filter/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> enableFilter(@PathVariable String metadataResolverId, @PathVariable String resourceId, @PathVariable String mode) throws
                    PersistentEntityNotFound, ForbiddenException, ScriptException {
        boolean status = "enable".equalsIgnoreCase(mode);
        MetadataFilter persistedFilter = filterService.updateFilterEnabledStatus(metadataResolverId, resourceId, status);
        return ResponseEntity.ok(persistedFilter);
    }    
    
    @PatchMapping("/MetadataResolvers/{resourceId}/{mode}") 
    @Transactional
    public ResponseEntity<?> enableProvider(@PathVariable String resourceId, @PathVariable String mode) throws
                    PersistentEntityNotFound, ForbiddenException, MetadataFileNotFoundException, InitializationException {
        boolean status = "enable".equalsIgnoreCase(mode);
        MetadataResolver existingResolver = metadataResolverService.findByResourceId(resourceId);
        existingResolver.setEnabled(status);
        existingResolver = metadataResolverService.updateMetadataResolverEnabledStatus(existingResolver);

        return ResponseEntity.ok(existingResolver);
    }
}