package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.env.PropertyResolver;
import org.springframework.core.env.PropertySources;
import org.springframework.core.env.PropertySourcesPropertyResolver;


/**
 * Implementation of {@link TokenPlaceholderValueResolvingService} based on Spring Framework's property resolver which
 * understands Shibboleth Idp custom placeholder prefix of <strong>%{</strong> and can resolve property values from these
 * placeholders against existing property sources.
 *
 * @author Dmitriy Kopylenko
 */
public class ShibbolethPlaceholderTokenAwareValueResolvingService implements TokenPlaceholderValueResolvingService {

    private PropertyResolver propertyResolver;

    ShibbolethPlaceholderTokenAwareValueResolvingService(PropertySources propertySources) {
        PropertySourcesPropertyResolver propertySourcesPropertyResolver = new PropertySourcesPropertyResolver(propertySources);
        propertySourcesPropertyResolver.setPlaceholderPrefix("%{");
        this.propertyResolver = propertySourcesPropertyResolver;
    }

    @Override
    public String resolveValueFromPossibleTokenPlaceholder(String potentialTokenPlaceholder) {
        return potentialTokenPlaceholder != null
                ? this.propertyResolver.resolveRequiredPlaceholders(potentialTokenPlaceholder)
                : potentialTokenPlaceholder;
    }
}
