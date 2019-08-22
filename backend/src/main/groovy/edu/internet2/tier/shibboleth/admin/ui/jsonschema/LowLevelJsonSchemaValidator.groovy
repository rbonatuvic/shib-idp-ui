package edu.internet2.tier.shibboleth.admin.ui.jsonschema

import mjson.Json
import org.springframework.http.HttpInputMessage

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.dynamicHttpMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.filesystemMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.localDynamicMetadataProviderSchema

/**
 * Currently uses mjson library.
 */
class LowLevelJsonSchemaValidator {

    static HttpInputMessage validatePayloadAgainstSchema(HttpInputMessage inputMessage, URI schemaUri) {
        def json = extractJsonPayload(inputMessage)
        def schema = Json.schema(schemaUri)
        doValidate(schema, json)
    }

    static HttpInputMessage validateMetadataResolverTypePayloadAgainstSchema(HttpInputMessage inputMessage,
                                                                             JsonSchemaResourceLocationRegistry schemaRegistry) {
        def json = extractJsonPayload(inputMessage)
        def schemaUri = null
        switch (json.asMap()['@type']) {
            case 'LocalDynamicMetadataResolver':
                schemaUri = localDynamicMetadataProviderSchema(schemaRegistry).uri
                break
            case 'DynamicHttpMetadataResolver':
                schemaUri = dynamicHttpMetadataProviderSchema(schemaRegistry).uri
                break
            case 'FilesystemMetadataResolver':
                schemaUri = filesystemMetadataProviderSchema(schemaRegistry).uri
                break
            default:
                break
        }
        if(!schemaUri) {
            return inputMessage
        }
        doValidate(Json.schema(schemaUri), json)
    }

    private static Json extractJsonPayload(HttpInputMessage inputMessage) {
        Json.read(new ByteArrayInputStream(inputMessage.body.bytes).getText())
    }

    private static HttpInputMessage doValidate(Json.Schema schema, Json json) {
        def validationResult = schema.validate(json)
        if (!validationResult.at('ok')) {
            throw new JsonSchemaValidationFailedException(validationResult.at('errors').asList())
        }
        return [
                getBody   : { new ByteArrayInputStream(bytes) },
                getHeaders: { inputMessage.headers }
        ] as HttpInputMessage
    }
}
