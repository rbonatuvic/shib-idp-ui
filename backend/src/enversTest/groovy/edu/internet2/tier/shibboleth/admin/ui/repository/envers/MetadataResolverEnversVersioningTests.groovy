package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ClasspathMetadataResource
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.TemplateScheme
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.PlatformTransactionManager
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes.HttpCachingType.file
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes.HttpCachingType.none
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.getModifiedEntityNames
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.getRevisionEntityForRevisionIndex
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.getTargetEntityForRevisionIndex
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.updateAndGetRevisionHistoryOfMetadataResolver

/**
 * Testing metadata resolver envers versioning
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, SearchConfiguration, TestConfiguration, ShibUIConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataResolverEnversVersioningTests extends Specification {

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    PlatformTransactionManager txMgr

    def "test versioning of LocalDynamicMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [LocalDynamicMetadataResolver.name]

        when:
        LocalDynamicMetadataResolver resolver = new LocalDynamicMetadataResolver(name: 'ldmr').with {
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes(refreshDelayFactor: 0.75)
            it
        }
        def resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                LocalDynamicMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 1
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'ldmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).dynamicMetadataResolverAttributes.refreshDelayFactor == 0.75
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        resolver.name = 'ldmr_UPDATED'
        resolver.dynamicMetadataResolverAttributes.refreshDelayFactor = 1.00
        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                LocalDynamicMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'ldmr_UPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).dynamicMetadataResolverAttributes.refreshDelayFactor == 1.00
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'ldmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).dynamicMetadataResolverAttributes.refreshDelayFactor == 0.75
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
    }

    def "test versioning of FileBackedHttpMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [FileBackedHttpMetadataResolver.name]

        when:
        FileBackedHttpMetadataResolver resolver = new FileBackedHttpMetadataResolver(name: 'fbmr').with {
            it.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes(proxyUser: 'proxyUser',
                    proxyPassword: 'proxyPass',
                    httpCaching: none)
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes(indexesRef: 'indexRef')
            it
        }
        def resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                FileBackedHttpMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 1
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'fbmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.proxyUser == 'proxyUser'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.proxyPassword == 'proxyPass'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.httpCaching == none
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.indexesRef == 'indexRef'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        resolver.name = 'fbmrUPDATED'
        resolver.httpMetadataResolverAttributes.proxyUser = 'proxyUserUPDATED'
        resolver.httpMetadataResolverAttributes.proxyPassword = 'proxyPassUPDATED'
        resolver.httpMetadataResolverAttributes.httpCaching = file
        resolver.reloadableMetadataResolverAttributes.indexesRef = 'indexRefUPDATED'

        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                FileBackedHttpMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'fbmrUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).httpMetadataResolverAttributes.proxyUser == 'proxyUserUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).httpMetadataResolverAttributes.proxyPassword == 'proxyPassUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).httpMetadataResolverAttributes.httpCaching == file
        getTargetEntityForRevisionIndex(resolverHistory, 1).reloadableMetadataResolverAttributes.indexesRef == 'indexRefUPDATED'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'fbmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.proxyUser == 'proxyUser'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.proxyPassword == 'proxyPass'
        getTargetEntityForRevisionIndex(resolverHistory, 0).httpMetadataResolverAttributes.httpCaching == none
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.indexesRef == 'indexRef'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
    }

    def "test versioning of DynamicHttpMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [DynamicHttpMetadataResolver.name,
                                                  TemplateScheme.name]

        when:
        DynamicHttpMetadataResolver resolver = new DynamicHttpMetadataResolver(name: 'dhmr').with {
            it.metadataRequestURLConstructionScheme = new TemplateScheme().with {
                it.content = 'content'
                it
            }
            it
        }

        def resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                DynamicHttpMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 1
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'dhmr'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        resolver.name = 'dhmrUPDATED'
        resolver.metadataRequestURLConstructionScheme.content = 'Updated content'

        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                DynamicHttpMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'dhmrUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).metadataRequestURLConstructionScheme.content == 'Updated content'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'dhmr'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()
    }

    def "test versioning of FilesystemMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [FilesystemMetadataResolver.name]

        when:
        FilesystemMetadataResolver resolver = new FilesystemMetadataResolver(name: 'fmr', metadataFile: 'metadata.xml').with {
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes(indexesRef: 'indexesRef')
            it
        }

        def resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                FilesystemMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 1
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'fmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).metadataFile == 'metadata.xml'
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.indexesRef == 'indexesRef'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        resolver.name = 'fmrUPDATED'
        resolver.metadataFile = 'metadataUPDATED.xml'
        resolver.reloadableMetadataResolverAttributes.indexesRef = 'indexesRefUPDATED'

        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                FilesystemMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'fmrUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).metadataFile == 'metadataUPDATED.xml'
        getTargetEntityForRevisionIndex(resolverHistory, 1).reloadableMetadataResolverAttributes.indexesRef == 'indexesRefUPDATED'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'fmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).metadataFile == 'metadata.xml'
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.indexesRef == 'indexesRef'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
    }

    def "test versioning of ResourceBackedMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [ResourceBackedMetadataResolver.name]

        when:
        ResourceBackedMetadataResolver resolver = new ResourceBackedMetadataResolver(name: 'rbmr').with {
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes(taskTimerRef: 'taskTimerRef')
            it.classpathMetadataResource = new ClasspathMetadataResource(fileResource: 'metadata.xml')
            it
        }

        def resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                ResourceBackedMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 1
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'rbmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.taskTimerRef == 'taskTimerRef'
        getTargetEntityForRevisionIndex(resolverHistory, 0).classpathMetadataResource.fileResource == 'metadata.xml'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()

        when:
        resolver.name = 'rbmrUPDATED'
        resolver.reloadableMetadataResolverAttributes.taskTimerRef = 'taskTimerRefUPDATED'
        resolver.classpathMetadataResource.fileResource = 'metadataUPDATED.xml'

        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                ResourceBackedMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'rbmrUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).reloadableMetadataResolverAttributes.taskTimerRef == 'taskTimerRefUPDATED'
        getTargetEntityForRevisionIndex(resolverHistory, 1).classpathMetadataResource.fileResource == 'metadataUPDATED.xml'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'rbmr'
        getTargetEntityForRevisionIndex(resolverHistory, 0).reloadableMetadataResolverAttributes.taskTimerRef == 'taskTimerRef'
        getTargetEntityForRevisionIndex(resolverHistory, 0).classpathMetadataResource.fileResource == 'metadata.xml'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
    }
}