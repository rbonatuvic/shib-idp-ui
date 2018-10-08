package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration;
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
    CustomPropertiesConfiguration customPropertiesConfiguration;

    @GetMapping(value = "/customAttributes")
    public ResponseEntity<?> getCustomAttributes() {
        System.out.println("WOO!\n" + customPropertiesConfiguration.getOverrides());
        return ResponseEntity.ok(customPropertiesConfiguration.getAttributes());
    }
}
