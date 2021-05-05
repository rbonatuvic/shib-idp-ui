package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import org.apache.lucene.analysis.Analyzer
import org.apache.lucene.analysis.en.EnglishAnalyzer
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

/**
 * A highly unnecessary test so that I can check to make sure that persistence is correct for the model
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, InternationalizationConfiguration, Config])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
class EntityDescriptorRepositoryTest extends Specification {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager

    @Autowired
    RoleRepository roleRepository

    @Autowired
    UserRepository userRepository

    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        it.init()
        it
    }

    def service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects), new UserService(roleRepository, userRepository))

    def "SHIBUI-553.2"() {
        when:
        def input = openSamlObjects.unmarshalFromXml(this.class.getResource('/metadata/SHIBUI-553.2.xml').bytes) as EntityDescriptor

        entityDescriptorRepository.save(input)

        def item1 = entityDescriptorRepository.findByResourceId(input.resourceId)
        entityManager.clear()
        def item2 = entityDescriptorRepository.findByResourceId(input.resourceId)

        then:
        item1.hashCode() == item2.hashCode()
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

    @TestConfiguration
    static class Config {
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
    }
}
