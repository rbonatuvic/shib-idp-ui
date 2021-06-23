package edu.internet2.tier.shibboleth.admin.ui.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import edu.internet2.tier.shibboleth.admin.ui.domain.Group;
import edu.internet2.tier.shibboleth.admin.ui.service.IGroupService;

@Controller
@RequestMapping(value = "/api/groups")
public class GroupController {
    @Autowired
    private IGroupService groupService;

    @PostMapping
    @Transactional
    public ResponseEntity<?> create(@RequestBody Group group) {
        // If already defined, we can't create a new one, nor will this call update the definition
        Group g = groupService.find(group.getResourceId());

        if (g != null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.METHOD_NOT_ALLOWED.value()),
                                            String.format("The group with resource id: [%s] and name: [%s] already exists.",
                                                            group.getResourceId(), group.getName())));
        }

        Group result = groupService.createOrUpdateGroup(g);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> update(@RequestBody Group group) {
        Group g = groupService.find(group.getResourceId());

        if (g == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s] and name: [%s]",
                                                            group.getResourceId(), group.getName())));
        }

        Group result = groupService.createOrUpdateGroup(g);
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
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s]", resourceId)));
        }
        return ResponseEntity.ok(g);
    }

    @DeleteMapping("/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String resourceId) {
        Group g = groupService.find(resourceId);

        if (g == null) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.NOT_FOUND.value()),
                                            String.format("Unable to find group with resource id: [%s]", resourceId)));
        }
        try {
            groupService.deleteDefinition(g);
        }
        catch (Exception e) {
            HttpHeaders headers = new HttpHeaders();
            headers.setLocation(ServletUriComponentsBuilder.fromCurrentServletMapping().path("/api/groups").build().toUri());

            return ResponseEntity.status(HttpStatus.CONFLICT).headers(headers)
                            .body(new ErrorResponse(String.valueOf(HttpStatus.CONFLICT.value()), String.format(
                                            "Unable to delete group with resource id: [%s] - remove all users from group",
                                            resourceId)));
        }
        return ResponseEntity.noContent().build();
    }
}
