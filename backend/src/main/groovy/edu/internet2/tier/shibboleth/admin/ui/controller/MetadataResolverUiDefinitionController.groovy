package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.filesystemMetadataProviderSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.localDynamicMetadataProviderSchema
//import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.dynamicHttpMetadataProviderSchema
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.SchemaType

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata resolvers user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 * @author Bill Smith (wsmith@unicon.net)
 */
@RestController
@RequestMapping('/api/ui/MetadataResolver')
class MetadataResolverUiDefinitionController {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    JsonSchemaResourceLocation jsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @GetMapping(value = "/{resolverType}")
    ResponseEntity<?> getUiDefinitionJsonSchema(@PathVariable String resolverType) {
        switch (SchemaType.getSchemaType(resolverType)) {
            case SchemaType.FILESYSTEM_METADATA_RESOLVER:
                jsonSchemaLocation = filesystemMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break
            case SchemaType.LOCAL_DYNAMIC_METADATA_RESOLVER:
                jsonSchemaLocation = localDynamicMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break
/*            case SchemaType.DYNAMIC_HTTP_METADATA_RESOLVER:
                jsonSchemaLocation = dynamicHttpMetadataProviderSchema(this.jsonSchemaResourceLocationRegistry)
                break*/
            default:
                throw new UnsupportedOperationException("Json schema for an unsupported metadata resolver (" + resolverType + ") was requested")
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

    @GetMapping(value = "/types")
    ResponseEntity<?> getResolverTypes() {
        return ResponseEntity.ok(SchemaType.getResolverTypes())
    }
}
