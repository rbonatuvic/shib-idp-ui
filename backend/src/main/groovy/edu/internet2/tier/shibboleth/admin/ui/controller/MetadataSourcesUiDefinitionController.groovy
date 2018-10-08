package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
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

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaUrl, Map)
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
    }
}
