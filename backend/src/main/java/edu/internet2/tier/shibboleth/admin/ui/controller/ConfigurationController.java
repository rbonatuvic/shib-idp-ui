package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.stream.Collectors;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Controller
@RequestMapping(value = "/api")
public class ConfigurationController {

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    EmailService emailService;

    @GetMapping(value = "/customAttributes")
    public ResponseEntity<?> getCustomAttributes() {
        return ResponseEntity.ok(customPropertiesConfiguration.getAttributes());
    }

    @GetMapping(value = "/supportedRoles")
    public ResponseEntity<?> getSupportedRoles() {
        return ResponseEntity.ok(roleRepository.findAll().stream().map(Role::getName).collect(Collectors.toList()));
    }
}
