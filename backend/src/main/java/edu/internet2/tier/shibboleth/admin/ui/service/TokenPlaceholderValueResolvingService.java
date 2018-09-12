package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.env.PropertyResolver;

/**
 * Generic API to resolve values from arbitrary tokenized placeholders such as '%{token.placeholder}' etc.
 *
 * @author Dmitriy Kopylenko
 */
@FunctionalInterface
public interface TokenPlaceholderValueResolvingService {

    String resolveValueFromPossibleTokenPlaceholder(String potentialTokenPlaceholder);

    static TokenPlaceholderValueResolvingService shibbolethPlaceholderAware(PropertyResolver propertyResolver) {
        return new ShibbolethPlaceholderTokenAwareValueResolvingService(propertyResolver);
    }
}
