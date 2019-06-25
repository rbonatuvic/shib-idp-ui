package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.EntitiesVersioningConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.NameIdFormatFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverVersionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification


/**
 * Testing metadata resolver envers versioning with metadata filters
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


    def "test versioning of MetadataResolver with EntityRoleWhiteListFilter"() {
        when: 'Add initial filter'
        def mr = new LocalDynamicMetadataResolver(name: 'resolver')
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
        filter = mr.metadataFilters[0]
        filter.retainedRoles = ['role1', 'role2']
        filter.removeEmptyEntitiesDescriptors = false
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
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters[0].retainedRoles.size() == 1
        mrv2.metadataFilters[0].retainedRoles == ['role1']
        mrv3.metadataFilters[0].retainedRoles.size() == 2
        mrv3.metadataFilters[0].retainedRoles == ['role1','role2']
        mrv3.metadataFilters[0].removeEmptyEntitiesDescriptors == false
    }

    //@DirtiesContext
    def "test versioning of MetadataResolver with EntityAttributesFilter"() {
        when: 'Add initial filter'
        def mr = new FileBackedHttpMetadataResolver(name: 'resolver')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        EntityAttributesFilter filter = new EntityAttributesFilter().with {
            it.attributeRelease = ['attr1']
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
        filter = mr.metadataFilters[0]
        filter.attributeRelease = ['attr1, attr2']
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
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters[0].attributes[0].attributeValues[0].xsStringvalue == 'attr1'
        mrv3.metadataFilters[0].attributes[0].attributeValues[0].xsStringvalue == 'attr1, attr2'
    }

    //@DirtiesContext
    def "test versioning of MetadataResolver with SignatureValidationFilter"() {
        when: 'Add initial filter'
        def mr = new DynamicHttpMetadataResolver(name: 'resolver')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        SignatureValidationFilter filter = new SignatureValidationFilter().with {
            it.certificateFile = 'cert1.file'
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
        mrv2.metadataFilters[0].certificateFile == 'cert1.file'

        when: 'Update filter'
        filter = mr.metadataFilters[0]
        filter.certificateFile = 'cert2.file'
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
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters[0].certificateFile == 'cert1.file'
        mrv3.metadataFilters[0].certificateFile == 'cert2.file'
    }

    def "test versioning of MetadataResolver with RequiredValidUntilFilter"() {
        when: 'Add initial filter'
        def mr = new FilesystemMetadataResolver(name: 'resolver')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        RequiredValidUntilFilter filter = new RequiredValidUntilFilter().with {
            it.maxValidityInterval = "PT1S"
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
        mrv2.metadataFilters[0].maxValidityInterval == 'PT1S'

        when: 'Update filter'
        filter = mr.metadataFilters[0]
        filter.maxValidityInterval = 'PT30S'
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
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters[0].maxValidityInterval == 'PT1S'
        mrv3.metadataFilters[0].maxValidityInterval == 'PT30S'
    }

    @DirtiesContext
    def "test versioning of MetadataResolver with NameIdFormatFilter"() {
        when: 'Add initial filter'
        def mr = new ResourceBackedMetadataResolver(name: 'resolver')
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        NameIdFormatFilter filter = new NameIdFormatFilter().with {
            it.formats = ['format1']
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
        mrv2.metadataFilters[0].formats == ['format1']

        when: 'Update filter'
        filter = mr.metadataFilters[0]
        filter.formats = ['format1', 'format2']
        filter.removeExistingFormats = true
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
        mrv1.metadataFilters.size() == 0
        mrv2.metadataFilters[0].formats == ['format1']
        mrv3.metadataFilters[0].formats == ['format1', 'format2']
        mrv3.metadataFilters[0].removeExistingFormats == true
    }

    def "test versioning of deleting a filter"() {
        when: 'Add initial filter'
        def mr = new LocalDynamicMetadataResolver(name: 'resolver')
        def filter = new EntityRoleWhiteListFilter()

        mr.metadataFilters.add(filter)
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        //And now remove filter
        filter = filterRepository.findByResourceId(filter.resourceId)
        mr.metadataFilters = []
        mr = EnversTestsSupport.doInExplicitTransaction(txMgr) {
            metadataResolverRepository.save(mr)
        }
        EnversTestsSupport.doInExplicitTransaction(txMgr) {
            filterRepository.delete(filter)
        }

        def versions = metadataResolverVersionService.findVersionsForMetadataResolver(mr.resourceId)
        def mrv1 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[0].id)
        def mrv2 = metadataResolverVersionService.findSpecificVersionOfMetadataResolver(mr.resourceId, versions[1].id)

        then:
        versions.size() == 2
        mrv1.metadataFilters.size() == 1
        mrv2.metadataFilters.size() == 0
    }
}
