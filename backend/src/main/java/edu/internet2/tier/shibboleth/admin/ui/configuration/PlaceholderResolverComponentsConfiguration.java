package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.TokenPlaceholderValueResolvingService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.PropertyResolver;

@Configuration
public class PlaceholderResolverComponentsConfiguration {

    @Bean
    public TokenPlaceholderValueResolvingService tokenPlaceholderValueResolvingService(PropertyResolver propertyResolver) {
        return TokenPlaceholderValueResolvingService.shibbolethPlaceholderAware(propertyResolver);
    }
}
