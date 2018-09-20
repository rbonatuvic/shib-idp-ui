package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.TokenPlaceholderValueResolvingService;
import edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.ConfigurableEnvironment;

@Configuration
public class PlaceholderResolverComponentsConfiguration {

    @Bean
    public TokenPlaceholderValueResolvingService tokenPlaceholderValueResolvingService(ConfigurableEnvironment env) {
        return TokenPlaceholderValueResolvingService.shibbolethPlaceholderPrefixAware(env.getPropertySources());
    }

    @Bean
    public TokenPlaceholderResolvers tokenPlaceholderResolvers(TokenPlaceholderValueResolvingService service) {
        return new TokenPlaceholderResolvers(service);
    }
}
