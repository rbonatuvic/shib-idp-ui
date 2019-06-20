package edu.internet2.tier.shibboleth.admin.ui.repository.envers

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
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
import static edu.internet2.tier.shibboleth.admin.ui.repository.envers.EnversTestsSupport.*

/**
 * Testing metadata resolver envers versioning
 */
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, InternationalizationConfiguration, SearchConfiguration, TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataResolverEnversVersioningTests extends Specification {

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    PlatformTransactionManager txMgr

    @Autowired
    OpenSamlObjects openSamlObjects

    def "test versioning of LocalDynamicMetadataResolver"() {
        setup:
        def expectedModifiedPersistentEntities = [LocalDynamicMetadataResolver.name]

        when:
        LocalDynamicMetadataResolver resolver = new LocalDynamicMetadataResolver(name: 'ldmr').with {
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes()
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
        def expectedModifiedPersistentEntities = [DynamicHttpMetadataResolver.name]

        when:
        DynamicHttpMetadataResolver resolver = new DynamicHttpMetadataResolver(name: 'dhmr')

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

        resolverHistory = updateAndGetRevisionHistoryOfMetadataResolver(resolver,
                metadataResolverRepository,
                DynamicHttpMetadataResolver,
                txMgr,
                entityManager)

        then:
        resolverHistory.size() == 2
        getTargetEntityForRevisionIndex(resolverHistory, 1).name == 'dhmrUPDATED'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 1).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 1).sort() == expectedModifiedPersistentEntities.sort()

        //Check the original revision is intact
        getTargetEntityForRevisionIndex(resolverHistory, 0).name == 'dhmr'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).principalUserName == 'anonymousUser'
        getRevisionEntityForRevisionIndex(resolverHistory, 0).timestamp > 0L
        getModifiedEntityNames(resolverHistory, 0).sort() == expectedModifiedPersistentEntities.sort()
    }
}
