package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import static edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget.EntityAttributesFilterTargetType.*
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes.HttpCachingType.memory

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class FileBackedHttpMetadataResolverRepositoryTests extends Specification {

    @Autowired
    FileBackedHttpMetadataResolverRepository repositoryUnderTest

    def "file backed http metadata resolver instances persist OK"() {
        when:
        def mdr = new FileBackedHttpMetadataResolver().with {
            it.name = "FileBackedHttpMetadata"

            it.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes().with {
                it.connectionRequestTimeout = "PT05"
                it.disregardTLSCertificate = true
                it.httpCaching = memory
                it
            }
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it.indexesRef = "indexesSpringBeanId"
                it
            }

            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = ENTITY
                    it.setValue(["hola"])
                    it
                }
                it
            })
            it
        }
        repositoryUnderTest.save(mdr)

        then:
        repositoryUnderTest.findAll().size() > 0
        FileBackedHttpMetadataResolver item = repositoryUnderTest.findByName("FileBackedHttpMetadata")

        item.name == "FileBackedHttpMetadata"
        item.metadataFilters.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.entityAttributesFilterTargetType == ENTITY
        item.metadataFilters[0].entityAttributesFilterTarget.value.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.value.get(0) == "hola"
        item.httpMetadataResolverAttributes.connectionRequestTimeout == "PT05"
        item.httpMetadataResolverAttributes.disregardTLSCertificate
        item.httpMetadataResolverAttributes.httpCaching == memory
        item.reloadableMetadataResolverAttributes.indexesRef == "indexesSpringBeanId"
    }
}
