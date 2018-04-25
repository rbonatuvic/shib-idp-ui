package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * A highly unnecessary test so that I can check to make sure that persistence is correct for the model
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class MetadataResolverRepositoryTest extends Specification {
    @Autowired
    MetadataResolverRepository metadataResolverRepository

    def "test persisting a metadata resolver"() {
        when:
        def mdr = new MetadataResolver().with {
            it.name = "testme"
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.setValue(["hola"])
                    return it
                }
                return it
            })
            return it
        }
        metadataResolverRepository.save(mdr)

        then:
        metadataResolverRepository.findAll().size() > 0
        MetadataResolver item = metadataResolverRepository.findByName("testme")
        item.name == "testme"
        item.metadataFilters.size() == 1
        item.metadataFilters.get(0).entityAttributesFilterTarget.entityAttributesFilterTargetType == EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
        item.metadataFilters.get(0).entityAttributesFilterTarget.value.size() == 1
        item.metadataFilters.get(0).entityAttributesFilterTarget.value.get(0) == "hola"
    }
}
