package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle
import edu.internet2.tier.shibboleth.admin.ui.domain.IRelyingPartyOverrideProperty
import edu.internet2.tier.shibboleth.admin.ui.security.model.User
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import lombok.NoArgsConstructor
import org.springframework.beans.factory.annotation.Autowired

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@NoArgsConstructor
class JsonSchemaBuilderService {
    @Autowired
    AttributeBundleService attributeBundleService

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @Autowired
    UserService userService

    void addReleaseAttributesToJson(Object json) {
        List<Object> result = new ArrayList<>()
        List<String> resultNames = new ArrayList<>()
        attributeBundleService.findAll().forEach({ bundle ->
            result.add(bundle.getAttributes())
            resultNames.add(bundle.getName())
        })

        result.addAll(customPropertiesConfiguration.getAttributes().collect {
            it['name']
        })
        resultNames.addAll(customPropertiesConfiguration.getAttributes().collect {
            it['displayName']
        })

        json['enum'] = result
        json['enumNames'] = resultNames
    }

    void addRelyingPartyOverridesToJson(Object json) {
        addRelyingPartyOverridesToJson(json, "saml")
    }

    void addRelyingPartyOverridesToJson(Object json, String protocol) {
        def properties = [:]
        customPropertiesConfiguration.getOverrides().stream().filter {
            it -> it.getProtocol().contains(protocol)
        }.each {
            if (it.protocol)
            def property
            if (it['displayType'] == 'list' || it['displayType'] == 'set' || it['displayType'] == 'selection_list') {
                property = [$ref: '#/definitions/' + it['name']]
            } else {
                property =
                        [title       : it['displayName'],
                         description : it['helpText'],
                         type        : ((IRelyingPartyOverrideProperty)it).getTypeForUI(),
                         default     : it['displayType'] == 'boolean' ? Boolean.getBoolean(it['defaultValue']) : it['defaultValue'],
                         examples    : it['examples']]
            }
            properties[(String) it['name']] = property
        }
        json['properties'] = properties
    }

    void addRelyingPartyOverridesCollectionDefinitionsToJson(Object json) {
        addRelyingPartyOverridesCollectionDefinitionsToJson(json, "saml")
    }

    void addRelyingPartyOverridesCollectionDefinitionsToJson(Object json, String protocol) {
        customPropertiesConfiguration.getOverrides().stream().filter {
            it -> it.getProtocol().contains(protocol) && it['displayType'] && (it['displayType'] == 'list' || it['displayType'] == 'set' || it['displayType'] == 'selection_list')
        }.each {
            def definition = [title      : it['displayName'],
                              description: it['helpText'],
                              type       : 'array']
            def items = [type     : 'string',
                         minLength: 1, // TODO: should this be configurable?
                         maxLength: 255] //TODO: or this?
            if (it['displayType'] == 'set' || it['displayType'] == 'list') {
                definition['uniqueItems'] = true
                items.examples = it['examples']
            } else if (it['displayType'] == 'selection_list') {
                definition['uniqueItems'] = false
                items.enum = it['examples']
            }
            items['default'] = it['defaultValue']

            definition['items'] = items
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