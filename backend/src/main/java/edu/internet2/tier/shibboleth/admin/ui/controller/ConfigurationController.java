package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Role;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.mail.MessagingException;
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

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<?> handleMessagingExcepgtion() {
        return ResponseEntity.badRequest().body(new ErrorResponse("12345", "Something exploded."));
    }

    @GetMapping(value = "/customAttributes")
    public ResponseEntity<?> getCustomAttributes() {
        return ResponseEntity.ok(customPropertiesConfiguration.getAttributes());
    }

    @GetMapping(value = "/supportedRoles")
    public ResponseEntity<?> getSupportedRoles() {
        return ResponseEntity.ok(roleRepository.findAll().stream().map(Role::getName).collect(Collectors.toList()));
    }

    @GetMapping(value = "/foo")
    public ResponseEntity<?> getFoo() throws MessagingException {
        emailService.sendNewUserMail("foobar");
        return ResponseEntity.ok().build();
    }
}
