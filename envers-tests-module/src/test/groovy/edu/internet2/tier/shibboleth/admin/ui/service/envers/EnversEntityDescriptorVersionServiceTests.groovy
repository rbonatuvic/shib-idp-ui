package edu.internet2.tier.shibboleth.admin.ui.service.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.*
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import java.time.LocalDateTime

import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.doInExplicitTransaction

@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration, EntitiesVersioningConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EnversEntityDescriptorVersionServiceTests extends Specification {

    @Autowired
    EntityDescriptorVersionService entityDescriptorVersionService

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityDescriptorService entityDescriptorService

    @Autowired
    PlatformTransactionManager txMgr

    def "versioning service returns correct number of versions sorted by modified date in natural order"() {
        when: 'Initial version'
        EntityDescriptor ed = new EntityDescriptor(entityID: 'ed', serviceProviderName: 'SP1')
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        def versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        then:
        versions.size() == 1
        versions[0].id
        versions[0].creator
        versions[0].date < LocalDateTime.now()

        when: 'Second version'
        ed.serviceProviderName = 'SP2'
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        then:
        versions.size() == 2
        versions[0].id && versions[1].id
        versions[0].creator && versions[1].creator
        versions[0].date < versions[1].date

        when: 'Third version'
        ed.serviceProviderName = 'SP3'
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        then:
        versions.size() == 3
        versions[0].id && versions[1].id && versions[2].id
        versions[0].creator && versions[1].creator && versions[2].creator
        (versions[0].date < versions[1].date) && (versions[1].date < versions[2].date)
    }

    def "versioning service returns correct entity descriptor for version number"() {
        when: 'Initial version'
        EntityDescriptor ed = new EntityDescriptor(entityID: 'ed', serviceProviderName: 'SP1', createdBy: 'anonymousUser')
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        def versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)
        def v1EdRepresentation = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, versions[0].id)

        then:
        v1EdRepresentation.serviceProviderName == 'SP1'
        v1EdRepresentation.id == ed.resourceId

        when: 'Update the original'
        ed.serviceProviderName = 'SP2'
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        versions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)
        def v2EdRepresentation = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, versions[1].id)

        then:
        v2EdRepresentation.serviceProviderName == 'SP2'
        v2EdRepresentation.id == ed.resourceId
    }

    def "versioning service returns null for non existent version number"() {
        when: 'Initial version'
        EntityDescriptor ed = new EntityDescriptor(entityID: 'ed', serviceProviderName: 'SP1', createdBy: 'anonymousUser')
        ed = doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        def edRepresentation = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, '1000')

        then:
        !edRepresentation
    }
}
