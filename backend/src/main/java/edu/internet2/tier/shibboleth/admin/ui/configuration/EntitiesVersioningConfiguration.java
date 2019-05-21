package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EntitiesVersioningConfiguration {

    //@Bean
    EntityDescriptorVersionService entityDescriptorVersionService(EntityDescriptorService entityDescriptorService) {
        //TODO create real impl when available
        return null;
    }
}
