package edu.internet2.tier.shibboleth.admin.ui.controller;

import javax.script.ScriptException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService;

@RestController
@RequestMapping("/api/activate")
public class ActivateController {

    @Autowired
    private EntityDescriptorService entityDescriptorService;
    
    @Autowired
    private FilterService filterService;
    
    @PatchMapping(path = "/entityDescriptor/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> enableEntityDescriptor(@PathVariable String resourceId, @PathVariable String mode) throws EntityNotFoundException, ForbiddenException {
        boolean status = "enable".equalsIgnoreCase(mode);
        EntityDescriptorRepresentation edr = entityDescriptorService.updateEntityDescriptorEnabledStatus(resourceId, status);
        return ResponseEntity.ok(edr);
    }
    
    @PatchMapping(path = "/MetadataResolvers/{metadataResolverId}/Filter/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> enableFilter(@PathVariable String metadataResolverId, @PathVariable String resourceId, @PathVariable String mode) throws EntityNotFoundException, ForbiddenException, ScriptException {
        boolean status = "enable".equalsIgnoreCase(mode);
        MetadataFilter persistedFilter = filterService.updateFilterEnabledStatus(metadataResolverId, resourceId, status);
        return ResponseEntity.ok(persistedFilter);
    }    
// Enable/disable for : , provider
}
