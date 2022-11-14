package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.UnsupportedShibUiOperationException;
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/approve")
@Tags(value = {@Tag(name = "approve")})
public class ApprovalController {
    @Autowired
    private DynamicRegistrationService dynamicRegistrationService;

    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @PatchMapping(path = "/DynamicRegistration/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> approveDynamicRegistration(@PathVariable String resourceId, @PathVariable String mode) throws PersistentEntityNotFound, ForbiddenException {
        boolean status = "approve".equalsIgnoreCase(mode);
        DynamicRegistrationRepresentation drr = dynamicRegistrationService.approveDynamicRegistration(resourceId, status);
        return ResponseEntity.ok(drr);
    }

    @PatchMapping(path = "/entityDescriptor/{resourceId}/{mode}")
    @Transactional
    public ResponseEntity<?> approveEntityDescriptor(@PathVariable String resourceId, @PathVariable String mode) throws PersistentEntityNotFound, ForbiddenException {
        boolean status = "approve".equalsIgnoreCase(mode);
        EntityDescriptorRepresentation edr = entityDescriptorService.changeApproveStatusOfEntityDescriptor(resourceId, status);
        return ResponseEntity.ok(edr);
    }
}