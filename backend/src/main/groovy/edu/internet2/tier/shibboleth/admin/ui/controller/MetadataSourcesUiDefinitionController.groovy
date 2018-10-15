package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.MetadataSourcesJsonSchemaResourceLocation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata sources user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@RestController('/api/ui/MetadataSources')
class MetadataSourcesUiDefinitionController {

    @Autowired
    MetadataSourcesJsonSchemaResourceLocation jsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaLocation.url, Map)
            def widget = parsedJson["properties"]["attributeRelease"]["widget"]
            def data = []
            customPropertiesConfiguration.getAttributes().each {
                def attribute = [:]
                attribute["key"] = it["name"]
                attribute["label"] = it["displayName"]
                data << attribute
            }
            widget["data"] = data
            return ResponseEntity.ok(parsedJson)
        }
        catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body([jsonParseError              : e.getMessage(),
                           sourceUiSchemaDefinitionFile: this.jsonSchemaUrl])
        }
    }
}
