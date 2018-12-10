package edu.internet2.tier.shibboleth.admin.ui.jsonschema

import edu.internet2.tier.shibboleth.admin.ui.controller.ErrorResponse
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import mjson.Json
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.MethodParameter
import org.springframework.http.HttpInputMessage
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageConverter
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter

import javax.annotation.PostConstruct
import java.lang.reflect.Type

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema

/**
 * Controller advice implementation for validating relying party overrides payload coming from UI layer
 * against pre-defined JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@ControllerAdvice
class RelyingPartyOverridesJsonSchemaValidatingControllerAdvice extends RequestBodyAdviceAdapter {

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
        def bytes = inputMessage.body.bytes
        def schema = Json.schema(this.jsonSchemaLocation.uri)

        def stream = new ByteArrayInputStream(bytes)
        def validationResult = schema.validate(Json.read(stream.getText()))
        if (!validationResult.at('ok')) {
            throw new JsonSchemaValidationFailedException(validationResult.at('errors').asList())
        }
        return [
                getBody: { new ByteArrayInputStream(bytes) },
                getHeaders: { inputMessage.headers }
        ] as HttpInputMessage
    }

    @ExceptionHandler(JsonSchemaValidationFailedException)
    final ResponseEntity<?> handleJsonSchemaValidationFailedException(JsonSchemaValidationFailedException ex) {
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse("400", String.join('\n', ex.errors)))
    }

    @PostConstruct
    void init() {
        this.jsonSchemaLocation = metadataSourcesSchema(this.jsonSchemaResourceLocationRegistry);
    }
}
