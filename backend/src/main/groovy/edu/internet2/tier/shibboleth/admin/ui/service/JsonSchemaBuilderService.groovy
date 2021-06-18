package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import org.springframework.beans.factory.annotation.Autowired

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class JsonSchemaBuilderService {

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    UserService userService

    JsonSchemaBuilderService(UserService userService) {
        this.userService = userService
    }

    void addReleaseAttributesToJson(Object json) {
        json['enum'] = customPropertiesConfiguration.getAttributes().collect {
            it['name']
        }
    }

    void addRelyingPartyOverridesToJson(Object json) {
        def properties = [:]
        customPropertiesConfiguration.getOverrides().each {
            def property
            if (it['displayType'] == 'list' || it['displayType'] == 'set' || it['displayType'] == 'selection_list') {
                property = [$ref: '#/definitions/' + it['name']]
            } else {
                property =
                        [title       : it['displayName'],
                         description : it['helpText'],
                         type        : it['displayType'],
                         defaultValue: it['defaultValue'],
                         examples    : it['examples']]
            }
            properties[(String) it['name']] = property
        }
        json['properties'] = properties
    }

    void addRelyingPartyOverridesCollectionDefinitionsToJson(Object json) {
        customPropertiesConfiguration.getOverrides().stream().filter {
            it -> it['displayType'] && (it['displayType'] == 'list' || it['displayType'] == 'set' || it['displayType'] == 'selection_list')
        }.each {
            def definition = [title      : it['displayName'],
                              description: it['helpText'],
                              type       : 'array',
                              default    : null]
            if (it['displayType'] == 'set' || it['displayType'] == 'selection_list') {
                definition['uniqueItems'] = true
            } else if (it['displayType'] == 'list') {
                definition['uniqueItems'] = false
            }
            def items = [type     : 'string',
                         minLength: 1, // TODO: should this be configurable?
                         maxLength: 255] //TODO: or this?
            items.examples = it['examples']
            

            definition['items'] = items
            definition['defaultValue'] = it['defaultValue']
            json[(String) it['name']] = definition
        }
    }

    void hideServiceEnabledFromNonAdmins(Map json) {
        User currentUser = userService.getCurrentUser()
        if (currentUser != null && currentUser.role != 'ROLE_ADMIN') {
            // user isn't an admin, so hide 'ServiceEnabled'
            Map<String, String> serviceEnabled = (HashMap) json['properties']['serviceEnabled']
            serviceEnabled['readOnly'] = true
            serviceEnabled.remove('title')
            serviceEnabled.remove('description')
        }
    }
}
