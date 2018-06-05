package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class LocalDynamicMetadataResolverRepositoryTests extends Specification {

    @Autowired
    LocalDynamicMetadataResolverRepository repositoryUnderTest

    @Autowired
    EntityManager entityManager

    def "local dynamic metadata resolver instances persist OK"() {
        when:
        def mdr = new LocalDynamicMetadataResolver().with {
            it.name = 'LocalDynamicMetadataResolver'
            it.sourceDirectory = '/etc/shibui'
            it.sourceKeyGeneratorRef = 'sourceKeyGeneratorBean'
            it.sourceManagerRef = 'sourceManagerBean'
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes().with {
                it.cleanupTaskInterval = 'PT5H'
                it.maxCacheDuration = 'PT8H'
                it.initializeFromPersistentCacheInBackground = true
                it
            }

            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = ENTITY
                    it.setValue(['hola'])
                    it
                }
                it
            })

            it
        }
        repositoryUnderTest.save(mdr)

        then:
        repositoryUnderTest.findAll().size() > 0
        def item = repositoryUnderTest.findByName("LocalDynamicMetadataResolver")

        item.name == "LocalDynamicMetadataResolver"
        item.metadataFilters.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.entityAttributesFilterTargetType == ENTITY
        item.metadataFilters[0].entityAttributesFilterTarget.value.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.value.get(0) == "hola"
        item.sourceDirectory == '/etc/shibui'
        item.sourceKeyGeneratorRef == 'sourceKeyGeneratorBean'
        item.sourceManagerRef == 'sourceManagerBean'
        item.dynamicMetadataResolverAttributes.cleanupTaskInterval == 'PT5H'
        item.dynamicMetadataResolverAttributes.maxCacheDuration == 'PT8H'
        item.dynamicMetadataResolverAttributes.initializeFromPersistentCacheInBackground
    }

}
