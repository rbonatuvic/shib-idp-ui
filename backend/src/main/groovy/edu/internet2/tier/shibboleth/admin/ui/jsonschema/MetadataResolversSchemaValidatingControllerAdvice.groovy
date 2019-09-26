package edu.internet2.tier.shibboleth.admin.ui.jsonschema


import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.http.HttpInputMessage
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter

import java.lang.reflect.Type

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator.validateMetadataResolverTypePayloadAgainstSchema

/**
 * Controller advice implementation for validating metadata resolvers payload coming from UI layer
 * against pre-defined JSON schema for their respected types. Choosing of the appropriate  schema based on incoming
 * resolver types is delegated to @{LowLevelJsonSchemaValidator}.
 *
 * @author Dmitriy Kopylenko
 */
@ControllerAdvice
class MetadataResolversSchemaValidatingControllerAdvice extends RequestBodyAdviceAdapter {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    @Override
    boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        targetType.typeName == MetadataResolver.typeName
    }

    @Override
    HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter,
                                           Type targetType, Class<? extends HttpMessageConverter<?>> converterType)
            throws IOException {

        validateMetadataResolverTypePayloadAgainstSchema(inputMessage, jsonSchemaResourceLocationRegistry)
    }
}
