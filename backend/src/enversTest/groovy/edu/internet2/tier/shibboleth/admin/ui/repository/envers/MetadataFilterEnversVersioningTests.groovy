package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import javax.persistence.EntityManager

/**
 * Testing metadata resolver envers versioning
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, SearchConfiguration, TestConfiguration, EntitiesVersioningConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataFilterEnversVersioningTests extends Specification {

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    FilterRepository filterRepository

    @Autowired
    MetadataResolverVersionService metadataResolverVersionService

    @Autowired
    PlatformTransactionManager txMgr


    def "test versioning of LocalDynamicMetadataResolver"() {
        when: 'Add initial filter'
        LocalDynamicMetadataResolver mr = new LocalDynamicMetadataResolver(name: 'ldmr')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        EntityRoleWhiteListFilter filter = new EntityRoleWhiteListFilter().with {
            it.retainedRoles = ['role1']
            it
        }
        mr.metadataFilters.add(filter)
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        def versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def mrv1 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[0].id)
        def mrv2 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[1].id)


        then:
        versions.size() == 2
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters.size() == 1

        when: 'Update filter'
        filter = filterRepository.findByResourceId(filter.resourceId)
        filter.retainedRoles = ['role1', 'role2']
        filter = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            filterRepository.save(filter)
        }
        mr.markAsModified()
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        mrv1 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[0].id)
        mrv2 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[1].id)
        def mrv3 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[2].id)

        then:
        versions.size() == 3
    }
}
