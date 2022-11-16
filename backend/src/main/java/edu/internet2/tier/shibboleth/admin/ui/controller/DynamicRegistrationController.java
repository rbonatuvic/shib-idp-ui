package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.ConcurrentModificationException;

@RestController
@RequestMapping("/api")
@Tags(value = {@Tag(name = "oidc")})
public class DynamicRegistrationController {
    private static URI getResourceUriFor(String resourceId) {
        return ServletUriComponentsBuilder
                        .fromCurrentServletMapping().path("/api/DynamicRegistration")
                        .pathSegment(resourceId)
                        .build()
                        .toUri();
    }

    @Autowired
    DynamicRegistrationService dynamicRegistrationService;

    @PostMapping("/DynamicRegistration")
    @Transactional
    public ResponseEntity<?> create(@RequestBody DynamicRegistrationRepresentation dynRegRepresentation) throws ObjectIdExistsException {
        DynamicRegistrationRepresentation persisted = dynamicRegistrationService.createNew(dynRegRepresentation);
        return ResponseEntity.created(getResourceUriFor(persisted.getResourceId())).body(persisted);
    }

    @GetMapping(value = "/DynamicRegistrations", produces = "application/json")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() throws ForbiddenException {
        return ResponseEntity.ok(dynamicRegistrationService.getAllDynamicRegistrationsBasedOnUserAccess());
    }

    @GetMapping("/DynamicRegistrations/needsApproval")
    @Transactional
    public ResponseEntity<?> getAllNeedingApproval() throws ForbiddenException {
        return ResponseEntity.ok(dynamicRegistrationService.getAllDynamicRegistrationsNeedingApprovalBasedOnUserAccess());
    }

    /**
     * @throws ForbiddenException This call is used for the admin needs action list, therefore the user must be an admin
     */
    @Transactional
    @GetMapping(value = "/DynamicRegistrations/disabledSources")
    public ResponseEntity<?> getDisabledMetadataSources() throws ForbiddenException {
        return ResponseEntity.ok(dynamicRegistrationService.getDisabledDynamicRegistrations());
    }

    @GetMapping(value = "/DynamicRegistration/{resourceId}", produces = "application/json")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) throws ForbiddenException {
        return ResponseEntity.ok(dynamicRegistrationService.getOne(resourceId));
    }

    @DeleteMapping(value = "/DynamicRegistration/{resourceId}")
    @Transactional
    public ResponseEntity<?> deleteOne(@PathVariable String resourceId) throws ForbiddenException, PersistentEntityNotFound {
        dynamicRegistrationService.delete(resourceId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/DynamicRegistration/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@RequestBody DynamicRegistrationRepresentation dynRegRepresentation, @PathVariable String resourceId) throws ForbiddenException, ConcurrentModificationException, PersistentEntityNotFound {
        dynRegRepresentation.setResourceId(resourceId); // This should be the same already, but just to be safe...
        DynamicRegistrationRepresentation result = dynamicRegistrationService.update(dynRegRepresentation);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/DynamicRegistration/{resourceId}/changeGroup/{groupId}")
    @Transactional
    public ResponseEntity<?> updateGroupForEntityDescriptor(@PathVariable String resourceId, @PathVariable String groupId) throws ForbiddenException, PersistentEntityNotFound {
        DynamicRegistrationRepresentation result = dynamicRegistrationService.updateGroupForDynamicRegistration(resourceId, groupId);
        return ResponseEntity.ok().body(result);
    }

}