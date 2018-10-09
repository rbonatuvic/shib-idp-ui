package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomAttributesConfiguration

import org.springframework.beans.factory.BeanInitializationException
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
 * @author Bill Smith (wsmith@unicon.net)
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
    CustomAttributesConfiguration customAttributesConfiguration

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaUrl, Map)
            def widget = parsedJson["properties"]["attributeRelease"]["widget"]
            def data = []
            customAttributesConfiguration.getAttributes().each {
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

    @PostConstruct
    def init() {
        jsonSchemaUrl = this.resourceLoader.getResource(this.metadataSourcesUiSchemaLocation).getURL()
        //Detect malformed JSON schema early, during application start up and fail fast with useful exception message
        try {
            this.jacksonObjectMapper.readValue(this.jsonSchemaUrl, Map)
        }
        catch (Exception e) {
            def msg = """                        
                        An error is detected during JSON parsing => [${e.message}]
                        **********************************************************
                        Offending resource => [${this.jsonSchemaUrl}]
                      """
            throw new BeanInitializationException(msg.toString(), e)
        }
    }
}
