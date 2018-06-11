package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

/**
 * A highly unnecessary test so that I can check to make sure that persistence is correct for the model
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class MetadataResolverRepositoryTest extends Specification {
    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    EntityManager entityManager

    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))

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

    def "SHIBUI-553"() {
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

        def item1 = metadataResolverRepository.findByName('testme')
        entityManager.clear()
        def item2 = metadataResolverRepository.findByName('testme')

        then:
        item1.hashCode() == item2.hashCode()
    }
}
