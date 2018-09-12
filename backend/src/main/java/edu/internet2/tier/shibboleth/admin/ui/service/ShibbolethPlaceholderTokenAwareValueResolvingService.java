package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.env.PropertyResolver;

import java.util.Objects;

import static java.util.Objects.requireNonNull;

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

    private static final String SHIB_IDP_PLACEHOLDER_PREEFIX = "%{";

    private static final String STANDART_PLACEHOLDER_PREFIX = "${";

    ShibbolethPlaceholderTokenAwareValueResolvingService(PropertyResolver propertyResolver) {
        this.propertyResolver = propertyResolver;
    }

    @Override
    public String resolveValueFromTokenPlaceholder(String potentialTokenPlaceholder) {
        //Ignore nulls.
        if(potentialTokenPlaceholder == null) {
            return potentialTokenPlaceholder;
        }

        if(potentialTokenPlaceholder.contains(SHIB_IDP_PLACEHOLDER_PREEFIX)) {
            String normalizedTokenPlaceholder =
                    potentialTokenPlaceholder.replace(SHIB_IDP_PLACEHOLDER_PREEFIX, STANDART_PLACEHOLDER_PREFIX);
            //This call might result in IllegalArgumentException if it's unable to resolve passed in property(ies)
            //e.g. due to bad data sent, etc. This is OK, as passing correct data and ensuring that
            //property values are correctly set is the responsibility of the software operator
            String resolved = this.propertyResolver.resolveRequiredPlaceholders(normalizedTokenPlaceholder);

            //Indicates that malformed values such as %{incomplete.token are passed. Spring won't resolve and return
            //the value as is. Just change it back to the original shib-style token and return.
            if(resolved.equals(normalizedTokenPlaceholder)) {
                return resolved.replace(STANDART_PLACEHOLDER_PREFIX, SHIB_IDP_PLACEHOLDER_PREEFIX);
            }
            return resolved;
        }
        //No token placeholders, just return the given data as is
        return potentialTokenPlaceholder;
    }
}
