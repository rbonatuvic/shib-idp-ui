package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.i18n.MappedResourceBundleMessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

@Configuration
public class InternationalizationConfiguration {
    @Bean
    public LocaleResolver localeResolver() {
        // TODO if we want to control the order, we can implement our own locale resolver instead of using the SessionLocaleResolver.
        SessionLocaleResolver sessionLocaleResolver = new SessionLocaleResolver();
        return sessionLocaleResolver;
    }

    @Bean
    public MappedResourceBundleMessageSource messageSource() {
        MappedResourceBundleMessageSource source = new MappedResourceBundleMessageSource();
        source.setBasenames("i18n/messages");
        source.setUseCodeAsDefaultMessage(true);
        source.setFallbackToSystemLocale(false);
        return source;
    }
}
