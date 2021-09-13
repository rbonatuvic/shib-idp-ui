package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.service.AttributeBundleService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/custom/entity/bundles")
@Slf4j
public class AttributeBundleController {
    @Autowired AttributeBundleService attributeBundleService;

    @Secured("ROLE_ADMIN")
    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody AttributeBundle bundle) throws ObjectIdExistsException {
        AttributeBundle result = attributeBundleService.create(bundle);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) throws EntityNotFoundException {
        attributeBundleService.deleteDefinition(resourceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(attributeBundleService.findAll());
    }

    @Secured("ROLE_ADMIN")
    @PutMapping
    @Transactional
    public ResponseEntity<?> update(@RequestBody AttributeBundle bundle) throws EntityNotFoundException {
        AttributeBundle result = attributeBundleService.updateBundle(bundle);
        return ResponseEntity.ok(result);
    }
}