package edu.internet2.tier.shibboleth.admin.ui.service.envers


import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import java.time.ZonedDateTime


@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, TestConfiguration, SearchConfiguration, EntitiesVersioningConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@EnableJpaAuditing
class EnversMetadataResolverVersionServiceTests extends Specification {

    @Autowired
    MetadataResolverVersionService metadataResolverVersionService

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    PlatformTransactionManager txMgr

    def "versioning service returns correct number of versions sorted by modified date in natural order"() {
        when: 'Initial version'
        MetadataResolver mr = new LocalDynamicMetadataResolver(name: 'ldmr')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        def versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)

        then:
        versions.size() == 1
        versions[0].id
        versions[0].creator
        versions[0].date < ZonedDateTime.now()

        when: 'Second version'
        mr.name = 'ldmr2'
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)


        then:
        versions.size() == 2
        versions[0].id && versions[1].id
        versions[0].creator && versions[1].creator
        versions[0].date < versions[1].date

        when: 'Third version'
        mr.name = 'ldmr3'
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)

        then:
        versions.size() == 3
        versions[0].id && versions[1].id && versions[2].id
        versions[0].creator && versions[1].creator && versions[2].creator
        (versions[0].date < versions[1].date) && (versions[1].date < versions[2].date)
    }

    def "versioning service returns correct metadata resolver for version number"() {
        when: 'Initial version'
        MetadataResolver mr = new FilesystemMetadataResolver(name: 'fsmr')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        def versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def v1Mr = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[0].id)

        then:
        v1Mr.name == 'fsmr'
        v1Mr.resourceId == mr.resourceId

        when: 'Update the original'
        mr.name = 'fsmr2'
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def v2Mr = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[1].id)

        then:
        v2Mr.name == 'fsmr2'
        v2Mr.resourceId == mr.resourceId
    }

    def "versioning service returns null for non existent version number"() {
        when: 'Initial version'
        MetadataResolver mr = new ResourceBackedMetadataResolver(name: 'rbmr')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        def nonexitentMrVersion = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, '1000')

        then:
        !nonexitentMrVersion
    }

    def "versioning service returns null for non existent metadata resolver number"() {
        when: 'Initial version'
        MetadataResolver mr = new DynamicHttpMetadataResolver(name: 'dhmr')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        def versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def nonexitentMr = metadataResolverVersionService.findSpecificVersionOfMetadataResolver('non-existent', versions[0].id)

        then:
        !nonexitentMr
    }
}
