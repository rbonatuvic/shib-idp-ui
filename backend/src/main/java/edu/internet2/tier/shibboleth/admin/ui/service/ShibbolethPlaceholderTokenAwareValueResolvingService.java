package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.env.PropertyResolver;

/**
 * Implementation of {@link TokenPlaceholderValueResolvingService} based on Spring Framework's default property resolver
 * which understands and replaces Shibboleth Idp specific placeholder prefix of '%{' with standard Spring's placeholder
 * prefix of '${' before resolving.
 *
 * If passed it value does not contain Shibboleth Idp '%{}' placeholder token, returns that value as is.
 *
 * @author Dmitriy Kopylenko
 */
public class ShibbolethPlaceholderTokenAwareValueResolvingService implements TokenPlaceholderValueResolvingService {

    private PropertyResolver propertyResolver;

    ShibbolethPlaceholderTokenAwareValueResolvingService(PropertyResolver propertyResolver) {
        this.propertyResolver = propertyResolver;
    }

    @Override
    public String resolveValueFromTokenPlaceholder(String tokenPlaceholder) {
        return null;
    }
}
