package edu.internet2.tier.shibboleth.admin.ui.controller

import groovy.json.JsonSlurper
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.core.io.ResourceLoader
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata sources user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@RestController('/api/ui/metadataSources')
@ConfigurationProperties('shibui')
class MetadataSourcesUiDefinitionController {

    //Configured via @ConfigurationProperties with 'shibui.metadata-sources-ui-schema-location' property and default
    //value set here if that property is not set
    String metadataSourcesUiSchemaLocation = 'classpath:metadata-sources-ui-schema.json'

    URL jsonSchemaUrl

    MetadataSourcesUiDefinitionController(ResourceLoader resourceLoader) {
        jsonSchemaUrl = resourceLoader.getResource(metadataSourcesUiSchemaLocation).getURL()
    }

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        //JsonSlurper is not threadsafe, but cheap to init. New instance per-thread is the canonical usage
        def json = new JsonSlurper().parse(this.jsonSchemaUrl)
        ResponseEntity.ok(json)
    }
}
