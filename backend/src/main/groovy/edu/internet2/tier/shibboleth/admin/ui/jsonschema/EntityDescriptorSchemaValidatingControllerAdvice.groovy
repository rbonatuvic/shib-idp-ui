package edu.internet2.tier.shibboleth.admin.ui.jsonschema


import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.http.HttpInputMessage
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter

import javax.annotation.PostConstruct
import java.lang.reflect.Type

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator.validatePayloadAgainstSchema

/**
 * Controller advice implementation for validating relying party overrides payload coming from UI layer
 * against pre-defined JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
//@ControllerAdvice
class EntityDescriptorSchemaValidatingControllerAdvice extends RequestBodyAdviceAdapter {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    JsonSchemaResourceLocation jsonSchemaLocation

    @Override
    boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        targetType.typeName == EntityDescriptorRepresentation.typeName
    }

    @Override
    HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter,
                                           Type targetType, Class<? extends HttpMessageConverter<?>> converterType)
            throws IOException {

        return validatePayloadAgainstSchema(inputMessage, this.jsonSchemaLocation.uri)
    }

    @PostConstruct
    void init() {
        this.jsonSchemaLocation = metadataSourcesSchema(this.jsonSchemaResourceLocationRegistry)
    }
}
