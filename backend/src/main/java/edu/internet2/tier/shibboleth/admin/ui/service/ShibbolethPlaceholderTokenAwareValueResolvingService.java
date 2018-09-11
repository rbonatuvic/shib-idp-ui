package edu.internet2.tier.shibboleth.admin.ui.service;

/**
 * Implementation of {@link TokenPlaceholderValueResolvingService} based on Spring Framework's default property resolver
 * which understands and replaces Shibboleth Idp specific placeholder prefix of '%{' with standard Spring's placeholder
 * prefix of '${' before resolving.
 *
 * If passed it value does not contain Shibboleth Idp '%{}' placeholder token, returns that value as is.
 */
public class ShibbolethPlaceholderTokenAwareValueResolvingService implements TokenPlaceholderValueResolvingService {

    @Override
    public String resolveValueFromTokenPlaceholder(String tokenPlaceholder) {
        return null;
    }
}
