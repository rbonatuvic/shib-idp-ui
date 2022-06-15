package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@RestController
@RequestMapping(value = "/api")
public class ConfigurationController {

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration;

    @Autowired
    RoleRepository roleRepository;

    @GetMapping(value = "/customAttributes")
    @Tags(value = {@Tag(name = "attributes")})
    public ResponseEntity<?> getCustomAttributes() {
        return ResponseEntity.ok(customPropertiesConfiguration.getAttributes());
    }

    @GetMapping(value = "/supportedRoles")
    @Tags(value = {@Tag(name = "admin")})
    public ResponseEntity<?> getSupportedRoles() {
        return ResponseEntity.ok(roleRepository.findAll().stream().map(Role::getName).collect(Collectors.toList()));
    }
}