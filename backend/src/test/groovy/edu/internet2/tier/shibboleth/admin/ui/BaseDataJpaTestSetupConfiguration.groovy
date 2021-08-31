package edu.internet2.tier.shibboleth.admin.ui

import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.UserUpdatedEntityListener
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceForTesting
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import io.micrometer.core.instrument.search.Search
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary

@Configuration
@Import([ShibUIConfiguration.class, CustomPropertiesConfiguration.class, SearchConfiguration.class])
@ComponentScan(basePackages=[ "edu.internet2.tier.shibboleth.admin.ui.service", "edu.internet2.tier.shibboleth.admin.ui.security.service" ])
class BaseDataJpaTestSetupConfiguration {
    @Bean
    AttributeUtility attributeUtility(OpenSamlObjects openSamlObjects) {
        return new AttributeUtility(openSamlObjects)
    }

    @Bean
    @Primary
    GroupServiceForTesting groupServiceForTesting(GroupsRepository groupRepo, OwnershipRepository ownershipRepository) {
        GroupServiceForTesting result = new GroupServiceForTesting(new GroupServiceImpl().with {
            it.groupRepository = groupRepo
            it.ownershipRepository = ownershipRepository
            return it
        })
        result.ensureAdminGroupExists()
        return result
    }

    @Bean
    GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository ownershipRepository) {
        GroupUpdatedEntityListener listener = new GroupUpdatedEntityListener()
        listener.init(ownershipRepository)
        return listener
    }

    @Bean
    OpenSamlObjects openSamlObjects() {
        return new OpenSamlObjects()
    }

    @Bean
    UserUpdatedEntityListener userUpdatedEntityListener(OwnershipRepository ownershipRepository, GroupsRepository groupRepo) {
        UserUpdatedEntityListener listener = new UserUpdatedEntityListener()
        listener.init(ownershipRepository, groupRepo)
        return listener
    }
}