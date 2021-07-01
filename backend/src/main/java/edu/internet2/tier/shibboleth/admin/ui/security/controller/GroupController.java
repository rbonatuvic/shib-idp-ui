package edu.internet2.tier.shibboleth.admin.ui.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;

@Controller
@RequestMapping(value = "/api/admin/groups")
public class GroupController {
    @Autowired
    private IGroupService groupService;

    @Secured("ROLE_ADMIN")
    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody Group group) {
        // If already defined, we can't create a new one, nor will this call update the definition
        Group foundGroup = groupService.find(group.getResourceId());

        if (foundGroup != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.METHOD_NOT_ALLOWED.value()),
                                            String.format("The group with resource id: [%s] and name: [%s] already exists.",
                                                            group.getResourceId(), group.getName())));
        }

        Group result = groupService.createOrUpdateGroup(group);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @Secured("ROLE_ADMIN")
    @PutMapping
    @Transactional
    public ResponseEntity<?> update(@RequestBody Group group) {
        Group g = groupService.find(group.getResourceId());

        if (g == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups/{resourceId}").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s] and name: [%s]",
                                                            group.getResourceId(), group.getName())));
        }

        Group result = groupService.createOrUpdateGroup(group);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(groupService.findAll());
    }

    @GetMapping("/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) {
        Group g = groupService.find(resourceId);

        if (g == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s]", resourceId)));
        }
        return ResponseEntity.ok(g);
    }
    
    @Secured("ROLE_ADMIN")
    @DeleteMapping("/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) {
        Group g = groupService.find(resourceId);

        if (g == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s]", resourceId)));
        }
        if (!g.getUsers().isEmpty() || !g.getEntityDescriptors().isEmpty()) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/admin/groups/{resourceId}").build().toUri());

            return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), String.format(
                                            "Unable to delete group with resource id: [%s] - remove all users and entities from group first",
                                            resourceId)));
        }
        groupService.deleteDefinition(g);
        return ResponseEntity.noContent().build();
    }
}
