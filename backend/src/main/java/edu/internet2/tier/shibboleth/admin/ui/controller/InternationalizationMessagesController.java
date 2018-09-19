package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.i18n.MappedResourceBundleMessageSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.Set;
import java.util.stream.Collectors;

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

    @GetMapping(value = "/available")
    public ResponseEntity<?> getAvailableLocales() {
        Set<ResourceBundle> supportedLocaleResourceBundles = getResourceBundles();
        Set<Locale> supportedLocales = supportedLocaleResourceBundles
                .stream()
                .map(ResourceBundle::getLocale)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(supportedLocales);
    }

    /**
     * Get all available resource bundles in i18n/messages that matches a locale supported by this JRE.
     *
     * @return a set of resource bundles for supported locales for this system
     */
    private Set<ResourceBundle> getResourceBundles() {
        Set<ResourceBundle> resourceBundles = new HashSet<>();

        for (Locale locale : Locale.getAvailableLocales()) {
            try {
                resourceBundles.add(ResourceBundle.getBundle("i18n/messages", locale));
            } catch (MissingResourceException e) {
                // do nothing
            }
        }

        return Collections.unmodifiableSet(resourceBundles);
    }
}
