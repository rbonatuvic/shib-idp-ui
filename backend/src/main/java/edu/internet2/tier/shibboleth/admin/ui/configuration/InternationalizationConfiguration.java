package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.i18n.MappedResourceBundleMessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;

import java.util.Locale;

@Configuration
public class InternationalizationConfiguration {
    @Bean
    public LocaleResolver localeResolver() {
        // TODO if we want to control the order, we can implement our own locale resolver instead of using the SessionLocaleResolver.
        SessionLocaleResolver sessionLocaleResolver = new SessionLocaleResolver();

        // NOTE: If we set a default here, Locale.getDefault's behavior will be consistent, but then Accept-Language
        // is not honored (only ?lang=). If we do not set a default, the default is determined at runtime by the JVM.
        // This may break unit tests if the system does not determine the default to be English.
        // sessionLocaleResolver.setDefaultLocale(new Locale("en"));

        return sessionLocaleResolver;
    }

    @Bean
    public MappedResourceBundleMessageSource messageSource() {
        MappedResourceBundleMessageSource source = new MappedResourceBundleMessageSource();
        source.setBasenames("i18n/messages");
        source.setUseCodeAsDefaultMessage(false); //TODO Why was this true?
        source.setFallbackToSystemLocale(false); // allows us to return messages.properties instead of
                                                 // messages_en.properties for unsupported languages.
        return source;
    }
}
