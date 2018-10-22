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
 * @author Bill Smith (wsmith@unicon.net)
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
            addReleaseAttributesToJson(parsedJson['properties']['attributeRelease']['widget'])
            addRelyingPartyOverridesToJson(parsedJson["properties"]["relyingPartyOverrides"])
            addRelyingPartyOverridesCollectionDefinitions(parsedJson["definitions"])
            return ResponseEntity.ok(parsedJson)
        }
        catch (Exception e) {
            e.printStackTrace()
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body([jsonParseError              : e.getMessage(),
                           sourceUiSchemaDefinitionFile: this.jsonSchemaLocation.url])
        }
    }

    private void addReleaseAttributesToJson(Object json) {
        json['data'] = customPropertiesConfiguration.getAttributes().collect {
            ['key': it['name'], 'label': it['displayName']]
        }
    }

    private void addRelyingPartyOverridesToJson(Object json) {
        def properties = [:]
        customPropertiesConfiguration.getOverrides().each {
            def property = [:]
            if (it["displayType"] == "list"
                    || it["displayType"] == "set") {
                property['$ref'] = "#/definitions/" + it["name"]
            } else {
                property["title"] = it["displayName"]
                property["description"] = it["helpText"]
                property["type"] = it["displayType"]
                property["default"] = it["defaultValue"]
            }
            properties[it["name"]] = property
        }
        json["properties"] = properties
    }

    private void addRelyingPartyOverridesCollectionDefinitions(Object json) {
        customPropertiesConfiguration.getOverrides().stream().filter {
            it -> it["displayType"] && (it["displayType"] == "list" || it["displayType"] == "set")
        }.each {
            def definition = [:]
            definition["title"] = it["displayName"]
            definition["description"] = it["helpText"]
            definition["type"] = "array"
            if (it["displayType"] == "set") {
                definition["uniqueItems"] = true
            } else if (it["displayType"] == "list") {
                definition["uniqueItems"] = false
            }
            def items = [:]
            items["type"] = "string"
            items["widget"] = "datalist"
            def data = []
            it["defaultValues"].each { value ->
                data << value
            }
            items["data"] = data
            definition["items"] = items
            definition["default"] = null
            json[(String)it["name"]] = definition
        }
    }
}
