package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomAttributesConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Controller
@RequestMapping(value = "/api")
public class ConfigurationController {

    @Autowired
    CustomAttributesConfiguration customAttributesConfiguration;

    @GetMapping(value = "/customAttributes")
    public ResponseEntity<?> getCustomAttributes() {
        return ResponseEntity.ok(customAttributesConfiguration.getAttributes());
    }
}
