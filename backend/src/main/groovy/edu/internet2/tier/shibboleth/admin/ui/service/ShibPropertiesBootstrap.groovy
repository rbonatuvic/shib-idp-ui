package edu.internet2.tier.shibboleth.admin.ui.service

import com.opencsv.CSVReader
import edu.internet2.tier.shibboleth.admin.ui.domain.ShibConfigurationProperty
import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.context.event.ApplicationStartedEvent
import org.springframework.context.event.EventListener
import org.springframework.core.io.ClassPathResource
import org.springframework.core.io.Resource
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@Slf4j
class ShibPropertiesBootstrap {
    @Autowired
    private ShibConfigurationService service

    ShibPropertiesBootstrap(ShibConfigurationService service) {
        this.service = service
    }

    @Transactional
    @EventListener
    void bootstrapUsersAndRoles(ApplicationStartedEvent e) {
        log.info("Ensuring base Shibboleth properties configuration has loaded")

        Resource resource = new ClassPathResource('shib_configuration_prop.csv')
        final HashMap<String, ShibConfigurationProperty> propertiesMap = new HashMap<>()

        // Read in the defaults in the configuration file
        new CSVReader(new InputStreamReader(resource.inputStream)).each { fields ->
            def (resource_id,category,config_file,description,idp_version,module,module_version,note,default_value,property_name,property_type,selection_items,property_value) = fields
            ShibConfigurationProperty prop = new ShibConfigurationProperty().with {
                it.resourceId = resource_id
                it.category = category
                it.configFile = config_file
                it.description = description
                it.idpVersion = idp_version
                it.module = module
                it.moduleVersion = module_version
                it.note = note
                it.defaultValue = default_value
                it.description = description
                it.propertyName = property_name
                def pt = property_type
                it.setPropertyType(pt)
                it.selectionItems = selection_items
                // we shouldn't have property values coming in from the config...
                it
            }
            propertiesMap.put(prop.getPropertyName(), prop)
        }

        // If we already have the property in the db, ignore the configuration setup for that property
        service.getExistingPropertyNames().each {
            propertiesMap.remove(it)
        }

        // Save anything that's left
        if (propertiesMap.size() > 0) {
            log.info("Saving/loading [" + propertiesMap.size() + "] properties to the database")
            service.addAll(propertiesMap.values())
        }

        log.info("COMPLETED: ensuring base Shibboleth properties configuration has loaded")
    }
}