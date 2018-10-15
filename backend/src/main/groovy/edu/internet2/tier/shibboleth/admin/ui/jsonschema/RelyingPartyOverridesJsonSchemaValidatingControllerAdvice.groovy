package edu.internet2.tier.shibboleth.admin.ui.jsonschema

import org.springframework.core.MethodParameter
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter

import java.lang.reflect.Type

/**
 * Controller advice implementation for validating relying party overrides payload coming from UI layer
 * against pre-defined JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@ControllerAdvice
class RelyingPartyOverridesJsonSchemaValidatingControllerAdvice extends RequestBodyAdviceAdapter {

    @Override
    boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        def cls = targetType.typeName
        print('cx')
    }
}
