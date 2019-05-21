package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.versioning.Version
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

import java.time.LocalDateTime

@Configuration
class TestEntityDescriptorVersioningConfiguration {

    @Autowired
    EntityDescriptorService entityDescriptorService

    @Bean
    EntityDescriptorVersionService stubEntityDescriptorVersionService() {
        return new EntityDescriptorVersionService() {
            @Override
            List<Version> findVersionsForEntityDescriptor(String resourceId) {
                return [new Version(id: '1', creator: 'kramer', date: LocalDateTime.now().minusDays(3)),
                        new Version(id: '2', creator: 'newman', date: LocalDateTime.now())]
            }

            @Override
            EntityDescriptorRepresentation findSpecificVersionOfEntityDescriptor(String resourceId, String versionId) {
                return entityDescriptorService.createRepresentationFromDescriptor(new TestObjectGenerator().buildEntityDescriptor())
            }
        }
    }

}
