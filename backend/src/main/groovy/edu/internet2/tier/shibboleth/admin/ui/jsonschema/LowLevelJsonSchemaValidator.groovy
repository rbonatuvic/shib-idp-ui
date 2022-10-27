package edu.internet2.tier.shibboleth.admin.ui.jsonschema

import mjson.Json
import org.springframework.http.HttpInputMessage

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.dynamicHttpMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.entityAttributesFiltersSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.filesystemMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.localDynamicMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.nameIdFormatFilterSchema

/**
 * Currently uses mjson library.
 *
 * @author Dmitriy Kopylenko
 */
class LowLevelJsonSchemaValidator {

    static HttpInputMessage validateMetadataSourcePayloadAgainstSchema(HttpInputMessage inputMessage, HashMap<String, JsonSchemaResourceLocation> schemaLocations) {
        def origInput = [inputMessage.body.bytes, inputMessage.headers]
        def json = extractJsonPayload(origInput)
        def protocol = json.at("protocol")
        String key = protocol == null ? "SAML" : org.apache.commons.lang3.StringUtils.defaultIfEmpty(json.at("protocol").getValue(), "SAML")
        def schema = Json.schema(schemaLocations.get(key).getUri())
        doValidate(origInput, schema, json)
    }

    static HttpInputMessage validateMetadataResolverTypePayloadAgainstSchema(HttpInputMessage inputMessage, JsonSchemaResourceLocationRegistry schemaRegistry) {

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
        def origInput = [inputMessage.body.bytes, inputMessage.headers]
        def json = extractJsonPayload(origInput)
        def schemaUri = null
        switch (json.asMap()['@type']) {
            case 'EntityAttributes':
                schemaUri = entityAttributesFiltersSchema(schemaRegistry).uri
                break
            case 'NameIDFormat':
                schemaUri = nameIdFormatFilterSchema(schemaRegistry).uri
                break
            default:
                break
        }
        if (!schemaUri) {
            return newInputMessage(origInput)
        }
        doValidate(origInput, Json.schema(schemaUri), json)
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