package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import groovy.json.JsonOutput
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.io.ResourceLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

import javax.annotation.PostConstruct

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata sources user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@RestController('/api/ui/MetadataSources')
@ConfigurationProperties('shibui')
class MetadataSourcesUiDefinitionController {

    //Configured via @ConfigurationProperties with 'shibui.metadata-sources-ui-schema-location' property and default
    //value set here if that property is not explicitly set in application.properties
    String metadataSourcesUiSchemaLocation = 'classpath:metadata-sources-ui-schema.json'

    URL jsonSchemaUrl

    @Autowired
    ResourceLoader resourceLoader

    @Autowired
    ObjectMapper jacksonObjectMapper

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaUrl, Map)
            addReleaseAttributesToJson(parsedJson["properties"]["attributeRelease"]["widget"])
            addRelyingPartyOverridesToJson(parsedJson["properties"]["relyingPartyOverrides"])
            addRelyingPartyOverridesCollectionDefinitions(parsedJson["definitions"])
            println(JsonOutput.prettyPrint(JsonOutput.toJson(parsedJson)))
            return ResponseEntity.ok(parsedJson)
        }
        catch (Exception e) {
            e.printStackTrace()
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body([jsonParseError              : e.getMessage(),
                           sourceUiSchemaDefinitionFile: this.jsonSchemaUrl])
        }
    }

    private void addReleaseAttributesToJson(Object json) {
        def data = []
        customPropertiesConfiguration.getAttributes().each {
            def attribute = [:]
            attribute["key"] = it["name"]
            attribute["label"] = it["displayName"]
            data << attribute
        }
        json["data"] = data
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

    @PostConstruct
    def init() {
        jsonSchemaUrl = this.resourceLoader.getResource(this.metadataSourcesUiSchemaLocation).getURL()
    }
}
