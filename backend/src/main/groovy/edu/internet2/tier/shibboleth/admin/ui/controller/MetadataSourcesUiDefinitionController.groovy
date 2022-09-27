package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import edu.internet2.tier.shibboleth.admin.ui.service.JsonSchemaBuilderService
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.tags.Tags
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import javax.annotation.PostConstruct

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesOIDCSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSAMLSchema
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR

/**
 * Controller implementing REST resource responsible for exposing structure definition for metadata sources user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 * @author Bill Smith (wsmith@unicon.net)
 */
@RestController
@RequestMapping('/api/ui/MetadataSources')
@Tags(value = [@Tag(name = "ui")])
class MetadataSourcesUiDefinitionController {
    private static final Logger log = LoggerFactory.getLogger(MetadataSourcesUiDefinitionController.class);

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    private JsonSchemaResourceLocation oidcJsonSchemaLocation
    private JsonSchemaResourceLocation samlJsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @Autowired
    JsonSchemaBuilderService jsonSchemaBuilderService

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema(@RequestParam(defaultValue = "saml") String protocol) {
        URL url = protocol.equalsIgnoreCase("oidc") ? oidcJsonSchemaLocation.url : samlJsonSchemaLocation.url
        try {
            def parsedJson = jacksonObjectMapper.readValue(url, Map)
            jsonSchemaBuilderService.hideServiceEnabledFromNonAdmins(parsedJson)
            jsonSchemaBuilderService.addReleaseAttributesToJson(parsedJson['properties']['attributeRelease']['items'])
            jsonSchemaBuilderService.addRelyingPartyOverridesToJson(parsedJson['properties']['relyingPartyOverrides'])
            jsonSchemaBuilderService.addRelyingPartyOverridesCollectionDefinitionsToJson(parsedJson["definitions"])
            return ResponseEntity.ok(parsedJson)
        }
        catch (IOException e) {
            log.error("An error occurred while attempting to get json schema for metadata sources!", e)
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body([jsonParseError : e.getMessage(), sourceUiSchemaDefinitionFile: this.samlJsonSchemaLocation.url])
        }
    }

    @PostConstruct
    void init() {
        this.samlJsonSchemaLocation = metadataSourcesSAMLSchema(this.jsonSchemaResourceLocationRegistry);
        this.oidcJsonSchemaLocation = metadataSourcesOIDCSchema(this.jsonSchemaResourceLocationRegistry);
    }
}