package edu.internet2.tier.shibboleth.admin.ui.controller.advice

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.util.DurationUtility
import org.springframework.core.MethodParameter
import org.springframework.http.HttpInputMessage
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter

import java.lang.reflect.Type

/**
 * Controller adivce that makse sure that set durations make sense
 */
@ControllerAdvice
class DurationComparisonValidatingControllerAdvice extends RequestBodyAdviceAdapter {
    @Override
    boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        return MetadataResolver.isAssignableFrom(targetType)
    }

    @Override
    Object afterBodyRead(Object body, HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        MetadataResolver metadataResolver = (MetadataResolver)body
        if (metadataResolver.hasProperty('dynamicMetadataResolverAttributes')) {
            DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes = metadataResolver.dynamicMetadataResolverAttributes
            if (DurationUtility.toMillis(dynamicMetadataResolverAttributes.minCacheDuration) > DurationUtility.toMillis(dynamicMetadataResolverAttributes.maxCacheDuration)) {
                throw new MetadataResolverConfigurationValidationException('minimum cache duration larger than maximum')
            }
        }

        if (metadataResolver.hasProperty('reloadableMetadataResolverAttributes')) {
            ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes = metadataResolver.reloadableMetadataResolverAttributes
            if (DurationUtility.toMillis(reloadableMetadataResolverAttributes.minRefreshDelay) > DurationUtility.toMillis(reloadableMetadataResolverAttributes.maxRefreshDelay)) {
                throw new MetadataResolverConfigurationValidationException('minimum refresh delay duration larger than maximum')
            }
        }

        return body
    }
}
