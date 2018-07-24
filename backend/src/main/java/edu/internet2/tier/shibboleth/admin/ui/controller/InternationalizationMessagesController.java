package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.i18n.MappedResourceBundleMessageSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Locale;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Controller
@RequestMapping(value = "/api/messages")
public class InternationalizationMessagesController {
    @Autowired
    MappedResourceBundleMessageSource messageSource;

    @GetMapping
    public ResponseEntity<?> getAll(Locale locale) {
        return ResponseEntity.ok(messageSource.getMessagesMap(locale));
    }
}
