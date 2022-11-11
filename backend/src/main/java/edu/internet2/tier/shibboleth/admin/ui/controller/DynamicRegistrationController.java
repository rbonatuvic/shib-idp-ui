package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.DynamicRegistrationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.service.DynamicRegistrationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api")
@Tags(value = {@Tag(name = "oidc")})
public class DynamicRegistrationController {
    @Autowired
    DynamicRegistrationService dynamicRegistrationService;

    @PostMapping("/DynamicRegistration")
    @Transactional
    public ResponseEntity<?> create(@RequestBody DynamicRegistrationRepresentation dynRegRepresentation) throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException {
        DynamicRegistrationRepresentation persisted = dynamicRegistrationService.createNew(dynRegRepresentation);
        return ResponseEntity.created(getResourceUriFor(persisted.getResourceId())).body(persisted);
    }

    @GetMapping(value = "/DynamicRegistrations", produces = "application/json")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() throws ForbiddenException {
        return ResponseEntity.ok(dynamicRegistrationService.getAllDynamicRegistrationsBasedOnUserAccess());
    }

    private static URI getResourceUriFor(String resourceId) {
        return ServletUriComponentsBuilder
                        .fromCurrentServletMapping().path("/api/DynamicRegistration")
                        .pathSegment(resourceId)
                        .build()
                        .toUri();
    }


}