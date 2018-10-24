package edu.internet2.tier.shibboleth.admin.ui.controller

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation
import edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocationRegistry
import org.springframework.beans.factory.BeanInitializationException
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import javax.annotation.PostConstruct

import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaLocationLookup.metadataSourcesSchema
import static edu.internet2.tier.shibboleth.admin.ui.jsonschema.JsonSchemaResourceLocation.ShemaType.METADATA_SOURCES
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
class MetadataSourcesUiDefinitionController {

    @Autowired
    JsonSchemaResourceLocationRegistry jsonSchemaResourceLocationRegistry

    JsonSchemaResourceLocation jsonSchemaLocation

    @Autowired
    ObjectMapper jacksonObjectMapper

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @GetMapping
    ResponseEntity<?> getUiDefinitionJsonSchema() {
        try {
            def parsedJson = jacksonObjectMapper.readValue(this.jsonSchemaLocation.url, Map)
            addReleaseAttributesToJson(parsedJson['properties']['attributeRelease']['widget'])
            addRelyingPartyOverridesToJson(parsedJson['properties']['relyingPartyOverrides'])
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

    @PostConstruct
    void init() {
        this.jsonSchemaLocation = metadataSourcesSchema(this.jsonSchemaResourceLocationRegistry);
    }

    private void addReleaseAttributesToJson(Object json) {
        json['data'] = customPropertiesConfiguration.getAttributes().collect {
            [key: it['name'], label: it['displayName']]
        }
    }

    private void addRelyingPartyOverridesToJson(Object json) {
        def properties = [:]
        customPropertiesConfiguration.getOverrides().each {
            def property
            if (it['displayType'] == 'list'
                    || it['displayType'] == 'set') {
                property = [$ref: '#/definitions/' + it['name']]
            } else {
                property =
                        [title      : it['displayName'],
                         description: it['helpText'],
                         type       : it['displayType'],
                         default    : it['defaultValue']]
            }
            properties[(String) it['name']] = property
        }
        json['properties'] = properties
    }

    private void addRelyingPartyOverridesCollectionDefinitions(Object json) {
        customPropertiesConfiguration.getOverrides().stream().filter {
            it -> it['displayType'] && (it['displayType'] == 'list' || it['displayType'] == 'set')
        }.each {
            def definition = [title      : it['displayName'],
                              description: it['helpText'],
                              type       : 'array',
                              default    : null]
            if (it['displayType'] == 'set') {
                definition['uniqueItems'] = true
            } else if (it['displayType'] == 'list') {
                definition['uniqueItems'] = false
            }
            def items = [type     : 'string',
                         minLength: '1', // TODO: should this be configurable?
                         maxLength: '255'] //TODO: or this?
            items.widget = [id: 'datalist', data: it['defaultValues']]

            definition['items'] = items
            json[(String) it['name']] = definition
        }
    }
}
