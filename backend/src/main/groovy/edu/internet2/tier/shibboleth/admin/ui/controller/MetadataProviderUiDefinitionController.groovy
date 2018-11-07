package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import edu.internet2.tier.shibboleth.admin.ui.service.JsonSchemaBuilderService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import javax.annotation.PostConstruct

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.dynamicHttpMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.filesystemMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.localDynamicMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata sources user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 * @author Bill Smith (wsmith@unicon.net)
 */
@RestController
@RequestMapping('/api/ui/MetadataProvider')
class MetadataProviderUiDefinitionController {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    JsonSchemaResourceLocation jsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @GetMapping(value = "/{providerType}")
    ResponseEntity<?> getUiDefinitionJsonSchema(@PathVariable String providerType) {
        switch (JsonSchemaResourceLocation.SchemaType.valueOf(providerType)) {
            case SchemaType.LOCAL_DYNAMIC_METADATA_PROVIDER:
                jsonSchemaLocation = localDynamicMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break
            case SchemaType.FILESYSTEM_METADATA_PROVIDER:
                jsonSchemaLocation = filesystemMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break
            case SchemaType.DYNAMIC_HTTP_METADATA_PROVIDER:
                jsonSchemaLocation = dynamicHttpMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break
            default:
                throw new UnsupportedOperationException("Json schema for an unsupported metadata provider (" + providerType + ") was requested")
        }
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaLocation.url, Map)
            return ResponseEntity.ok(parsedJson)
        }
        catch (Exception e) {
            e.printStackTrace()
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body([jsonParseError              : e.getMessage(),
                           sourceUiSchemaDefinitionFile: this.jsonSchemaLocation.url])
        }
    }

    @PostConstruct
    void init() {
        this.jsonSchemaLocation = metadataSourcesSchema(this.jsonSchemaResourceLocationRegistry)
    }
}
