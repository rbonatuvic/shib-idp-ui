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

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesOIDCSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSAMLSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.LowLevelJsonSchemaValidator.validateMetadataSourcePayloadAgainstSchema

/**
 * Controller advice implementation for validating relying party overrides payload coming from UI layer
 * against pre-defined JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@ControllerAdvice
class EntityDescriptorSchemaValidatingControllerAdvice extends RequestBodyAdviceAdapter {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    private HashMap<String, JsonSchemaResourceLocation> schemaLocations = new HashMap<>()

    @Override
    boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
        targetType.typeName == EntityDescriptorRepresentation.typeName
    }

    @Override
    HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) throws IOException {
        return validateMetadataSourcePayloadAgainstSchema(inputMessage, this.schemaLocations)
    }

    @PostConstruct
    void init() {
        this.schemaLocations.put("SAML", metadataSourcesSAMLSchema(this.jsonSchemaResourceLocationRegistry))
        this.schemaLocations.put("OIDC", metadataSourcesOIDCSchema(this.jsonSchemaResourceLocationRegistry))
    }
}