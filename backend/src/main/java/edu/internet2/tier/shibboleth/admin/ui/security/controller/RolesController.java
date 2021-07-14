package edu.internet2.tier.shibboleth.admin.ui.security.controller;

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

import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.RoleExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IRolesService;

@RestController
@RequestMapping("/api/admin/roles")
public class RolesController {
    @Autowired
    private IRolesService rolesService;

    @Secured("ROLE_ADMIN")
    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody Role role) throws RoleExistsConflictException {
        Role result = rolesService.createRole(role);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) throws EntityNotFoundException, RoleDeleteException {
        rolesService.deleteDefinition(resourceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(rolesService.findAll());
    }

    @GetMapping("/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) throws EntityNotFoundException {
        Role role = rolesService.findByResourceId(resourceId);
        return ResponseEntity.ok(role);
    }

    @Secured("ROLE_ADMIN")
    @PutMapping
    @Transactional
    public ResponseEntity<?> update(@RequestBody Role role) throws EntityNotFoundException {
        Role result = rolesService.updateRole(role);
        return ResponseEntity.ok(result);
    }
}
