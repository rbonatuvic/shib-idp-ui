package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import org.springframework.beans.factory.annotation.Autowired

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class JsonSchemaBuilderService {

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    void addReleaseAttributesToJson(Object json) {
        json['data'] = customPropertiesConfiguration.getAttributes().collect {
            [key: it['name'], label: it['displayName']]
        }
    }

    void addRelyingPartyOverridesToJson(Object json) {
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

    void addRelyingPartyOverridesCollectionDefinitionsToJson(Object json) {
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
