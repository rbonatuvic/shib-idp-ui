package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import groovy.json.JsonOutput
import org.apache.commons.lang.StringUtils
import org.springframework.beans.factory.annotation.Autowired

import java.security.Principal

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class JsonSchemaBuilderService {

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    UserRepository userRepository;

    JsonSchemaBuilderService(UserRepository userRepository) {
        this.userRepository = userRepository
    }

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
                         type       : it['displayType']]
                if (it['displayType'] == 'boolean') {
                    property['default'] = (Boolean)(it['defaultValue'])
                } else {
                    property['default'] = it['defaultValue']
                }
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
                         minLength: 1, // TODO: should this be configurable?
                         maxLength: 255] //TODO: or this?
            items.widget = [id: 'datalist', data: it['defaultValues']]

            definition['items'] = items
            json[(String) it['name']] = definition
        }
    }

    void hideServiceEnabledFromNonAdmins(Map json, Principal principal) {
        if (principal != null && StringUtils.isNotBlank(principal.getName())) {
            def user = userRepository.findByUsername(principal.getName())
            if (user.isPresent() && user.get().role != 'ROLE_ADMIN') {
                // user isn't an admin, so hide 'ServiceEnabled'
                Map<String, String> serviceEnabled = (HashMap) json['properties']['serviceEnabled']
                serviceEnabled['type'] = 'hidden'
                serviceEnabled.remove('title')
                serviceEnabled.remove('description')
            }
        }
    }
}
