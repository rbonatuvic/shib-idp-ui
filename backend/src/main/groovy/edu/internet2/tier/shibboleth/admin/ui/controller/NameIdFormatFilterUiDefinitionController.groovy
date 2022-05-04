package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import edu.internet2.tier.shibboleth.admin.ui.service.JsonSchemaBuilderService
import groovy.util.logging.Slf4j
import io.swagger.v3.oas.annotations.tags.Tag
import io.swagger.v3.oas.annotations.tags.Tags
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import javax.annotation.PostConstruct

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.nameIdFormatFilterSchema
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR

/**
 * Controller implementing REST resource responsible for exposing structure definition for nameid format filter user
 * interface in terms of JSON schema.
 *
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping('/api/ui/NameIdFormatFilter')
@Slf4j
@Tags(value = [@Tag(name = "ui")])
class NameIdFormatFilterUiDefinitionController {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    JsonSchemaResourceLocation jsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @Autowired
    JsonSchemaBuilderService jsonSchemaBuilderService

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaLocation.url, Map)
            jsonSchemaBuilderService.addRelyingPartyOverridesCollectionDefinitionsToJson(parsedJson["definitions"])
            return ResponseEntity.ok(parsedJson)
        }
        catch (Exception e) {
            log.error(e.getMessage(), e)
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body([jsonParseError              : e.getMessage(),
                           sourceUiSchemaDefinitionFile: this.jsonSchemaLocation.url])
        }
    }

    @PostConstruct
    void init() {
        this.jsonSchemaLocation = nameIdFormatFilterSchema(this.jsonSchemaResourceLocationRegistry)
    }
}