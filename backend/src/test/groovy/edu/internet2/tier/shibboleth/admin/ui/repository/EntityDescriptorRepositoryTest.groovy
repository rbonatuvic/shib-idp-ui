package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.EntityDescriptorService
import org.apache.lucene.analysis.Analyzer
import org.apache.lucene.analysis.en.EnglishAnalyzer
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration

import javax.persistence.EntityManager
import java.util.stream.Stream

@ContextConfiguration(classes = [EDRLocalConfig])
class EntityDescriptorRepositoryTest extends AbstractBaseDataJpaTest {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityDescriptorService entityDescriptorService

    @Autowired
    EntityManager entityManager

    @Autowired
    OpenSamlObjects openSamlObjects

    def "SHIBUI-553.2"() {
        when:
        def input = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-553.2.xml').bytes) as EntityDescriptor
        entityDescriptorRepository.save(input)
        entityManager.flush()
        entityManager.clear()

        def hashCode1 = entityDescriptorRepository.findByResourceId(input.resourceId).hashCode()

        entityManager.clear()
        def hashCode2 = entityDescriptorRepository.findByResourceId(input.resourceId).hashCode()

        then:
        hashCode1 == hashCode2
    }

    def "SHIBUI-950"() {
        when:
        def input = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-950.xml').bytes) as EntityDescriptor
        entityDescriptorRepository.save(input)

        then:
        noExceptionThrown()
    }

    def "SHIBUI-1772"() {
        when:
        def input = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-1772.xml').bytes) as EntityDescriptor
        entityDescriptorRepository.save(input)

        then:
        noExceptionThrown()
    }

    def "SHIBUI-1849 - extend data model for ownership"() {
        given:
        def group = new Group().with {
            it.name = "group-name"
            it.description = "some description"
            it
        }
        group = groupService.createGroup(group)

        def gList = groupService.findAll()
        def groupFromDb = gList.get(0).asType(Group)

        def ed = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-553.2.xml').bytes) as EntityDescriptor
        ed.with {
            it.idOfOwner = groupFromDb.resourceId
        }
        entityDescriptorRepository.saveAndFlush(ed)

        when:
        def edStreamFromDb = entityDescriptorRepository.findAllStreamByIdOfOwner(null)

        then:
        ((Stream) edStreamFromDb).count() == 0

        when:
        def edStreamFromDb2 = entityDescriptorRepository.findAllStreamByIdOfOwner("random value")

        then:
        ((Stream) edStreamFromDb2).count() == 0

        when:
        def edStreamFromDb3 = entityDescriptorRepository.findAllStreamByIdOfOwner(groupFromDb.resourceId)

        then:
        ((Stream) edStreamFromDb3).count() == 1
    }

    @TestConfiguration
    private static class EDRLocalConfig {
        @Bean
        MetadataResolver metadataResolver() {
            new OpenSamlChainingMetadataResolver().with {
                it.id = 'tester'
                it.initialize()
                return it
            }
        }

        @Bean
        Analyzer analyzer() {
            return new EnglishAnalyzer()
        }

        @Bean
        CustomEntityAttributesDefinitionServiceImpl customEntityAttributesDefinitionServiceImpl(EntityManager entityManager, CustomEntityAttributeDefinitionRepository customEntityAttributeDefinitionRepository) {
            new CustomEntityAttributesDefinitionServiceImpl().with {
                it.repository = customEntityAttributeDefinitionRepository
                return it
            }
        }
    }
}