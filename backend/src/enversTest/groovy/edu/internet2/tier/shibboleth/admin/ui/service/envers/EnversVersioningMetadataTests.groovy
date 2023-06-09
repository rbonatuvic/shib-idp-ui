package edu.internet2.tier.shibboleth.admin.ui.service.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorVersionService
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration, EntitiesVersioningConfiguration, ShibUIConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@EnableJpaAuditing
class EnversVersioningMetadataTests extends Specification {

    @Autowired
    MetadataResolverVersionService metadataResolverVersionService

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityDescriptorVersionService entityDescriptorVersionService

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    PlatformTransactionManager txMgr

    def "versioning service uses versioning metadata from target entities enhanced by boot auditing facility"() {
        when: 'Initial versions'
        MetadataResolver mr = new LocalDynamicMetadataResolver(name: 'resolver')
        EntityDescriptor ed = new EntityDescriptor(serviceProviderName: 'descriptor')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        ed = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        def mrVersions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def edVersions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        then:
        mrVersions[0].creator == mr.createdBy
        mrVersions[0].date == mr.modifiedDateAsZonedDateTime()
        edVersions[0].creator == ed.createdBy
        edVersions[0].date == ed.modifiedDateAsZonedDateTime()

        when: 'new version due to update'
        mr.name = 'UPDATED'
        ed.serviceProviderName = 'UPDATED'
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        ed = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        mrVersions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        edVersions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)

        then:
        mrVersions[1].creator == mr.modifiedBy
        mrVersions[1].date == mr.modifiedDateAsZonedDateTime()
        edVersions[1].creator == ed.modifiedBy
        edVersions[1].date == ed.modifiedDateAsZonedDateTime()
    }

    def "test current version correct logic"() {
        when: 'Initial versions'
        MetadataResolver mr = new DynamicHttpMetadataResolver(name: 'resolver')
        EntityDescriptor ed = new EntityDescriptor(serviceProviderName: 'descriptor')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        ed = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        def mrVersions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def edVersions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)
        def mrV1 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, mrVersions[0].id)
        def edV1 = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, edVersions[0].id)

        then:
        mrV1.isCurrent()
        edV1.isCurrent()

        when: 'new version due to update'
        mr.name = 'UPDATED'
        ed.serviceProviderName = 'UPDATED'
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        ed = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            entityDescriptorRepository.save(ed)
        }
        mrVersions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        edVersions = entityDescriptorVersionService.findVersionsForEntityDescriptor(ed.resourceId)
        mrV1 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, mrVersions[0].id)
        edV1 = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, edVersions[0].id)
        def mrV2 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, mrVersions[1].id)
        def edV2 = entityDescriptorVersionService.findSpecificVersionOfEntityDescriptor(ed.resourceId, edVersions[1].id)

        then:
        !mrV1.isCurrent()
        !edV1.isCurrent()
        mrV2.isCurrent()
        edV2.isCurrent()
    }
}