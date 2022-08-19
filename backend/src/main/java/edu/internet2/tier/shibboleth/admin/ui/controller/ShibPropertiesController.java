package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.service.ShibConfigurationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
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
@RequestMapping(value = "/api/shib")
@Tags(value = {@Tag(name = "Shibboleth Properties")})
public class ShibPropertiesController {
    @Autowired
    private ShibConfigurationService service;

    @GetMapping("/properties")
    @Transactional(readOnly = true)
    @Operation(description = "Return all the configuration properties - used to populate the UI with the know configuration properties",
               summary = "Return all the configuration properties - used to populate the UI with the know configuration properties", method = "GET")
    public ResponseEntity<?> getAllConfigurationProperties() {
        return ResponseEntity.ok(service.getAllConfigurationProperties());
    }

    /**
     * @return a List of the set names and their ids
     */
    @GetMapping("/property/set")
    @Transactional(readOnly = true)
    @Operation(description = "Return a list of all the set names and their resourceId",
               summary = "Return a list of all the set names and their resourceId", method = "GET")
    public ResponseEntity<?> getAllPropertySets() {
        return ResponseEntity.ok(service.getAllPropertySets());
    }

    @GetMapping("/property/set/{resourceId}")
    @Transactional(readOnly = true)
    @Operation(description = "Return the property set with the given resourceId",
               summary = "Return the property set with the given resourceId", method = "GET")
    public ResponseEntity<?> getPropertySet(@PathVariable Integer resourceId) throws EntityNotFoundException {
        return ResponseEntity.ok(service.getSet(resourceId));
    }

    @DeleteMapping("/property/set/{resourceId}")
    @Secured("ROLE_ADMIN")
    @Transactional
    public ResponseEntity<?> deletePropertySet(@PathVariable Integer resourceId) throws EntityNotFoundException {
        service.delete(resourceId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/property/set")
    @Secured("ROLE_ADMIN")
    @Transactional
    @Operation(description = "Create a property set with all new information - must not be an existing set",
               summary = "Create a property set with all new information - must not be an existing set", method = "POST")
    public ResponseEntity<?> createPropertySet(@RequestBody ShibPropertySet newSet) throws ObjectIdExistsException {
        ShibPropertySet result = service.create(newSet);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping("/property/set/{resourceId}")
    @Secured("ROLE_ADMIN")
    @Transactional
    @Operation(description = "Update a property set with with the matching resourceId - must exist",
               summary = "Update an existing property set with the matching resourceId - must exist", method = "PUT")
    public ResponseEntity<?> updatePropertySet(@RequestBody ShibPropertySet setToUpdate, @PathVariable int resourceId) throws EntityNotFoundException {
        ShibPropertySet result = service.update(setToUpdate);
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }
}