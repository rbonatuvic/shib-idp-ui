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
        def origInput = [inputMessage.body.bytes, inputMessage.headers]
        def json = extractJsonPayload(origInput)
        def schema = Json.schema(schemaUri)
        doValidate(origInput, schema, json)
    }

    static HttpInputMessage validateMetadataResolverTypePayloadAgainstSchema(HttpInputMessage inputMessage,
                                                                             JsonSchemaResourceLocationRegistry schemaRegistry) {

        def origInput = [inputMessage.body.bytes, inputMessage.headers]
        def json = extractJsonPayload(origInput)
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
        if (!schemaUri) {
            return newInputMessage(origInput)
        }
        doValidate(origInput, Json.schema(schemaUri), json)
    }

    static HttpInputMessage validateMetadataFilterTypePayloadAgainstSchema(HttpInputMessage inputMessage,
                                                                           JsonSchemaResourceLocationRegistry schemaRegistry) {
        null
    }

    private static Json extractJsonPayload(List origInput) {
        Json.read(new ByteArrayInputStream(origInput[0]).getText())
    }

    private static HttpInputMessage doValidate(List origInput, Json.Schema schema, Json json) {
        def validationResult = schema.validate(json)
        if (!validationResult.at('ok')) {
            throw new JsonSchemaValidationFailedException(validationResult.at('errors').asList())
        }
        newInputMessage(origInput)
    }

    private static newInputMessage(origInput) {
        [
                getBody   : { new ByteArrayInputStream(origInput[0]) },
                getHeaders: { origInput[1] }
        ] as HttpInputMessage
    }
}
