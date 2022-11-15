package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupDeleteException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.GroupExistsConflictException;
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
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
@RequestMapping(value = "/api/admin/groups")
@Tags(value = {@Tag(name = "admin")})
public class GroupController {
    @Autowired
    private IGroupService groupService;

    @Autowired
    private EntityDescriptorService entityDescriptorService;

    @Secured("ROLE_ADMIN")
    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody Group group) throws GroupExistsConflictException, InvalidGroupRegexException {
        Group result = groupService.createGroup(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) throws PersistentEntityNotFound, GroupDeleteException {
        groupService.deleteDefinition(resourceId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(groupService.findAll());
    }

    @GetMapping("/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) throws PersistentEntityNotFound {
        Group g = groupService.find(resourceId);
        if (g == null) {
            throw new PersistentEntityNotFound(String.format("Unable to find group with resource id: [%s]", resourceId));
        }
        return ResponseEntity.ok(g);
    }
    
    @Secured("ROLE_ADMIN")
    @PutMapping
    @Transactional
    public ResponseEntity<?> update(@RequestBody Group group) throws PersistentEntityNotFound, InvalidGroupRegexException {
        Group result = groupService.updateGroup(group);
        entityDescriptorService.checkApprovalStatusOfEntitiesForGroup(result);
        return ResponseEntity.ok(result);
    }
}