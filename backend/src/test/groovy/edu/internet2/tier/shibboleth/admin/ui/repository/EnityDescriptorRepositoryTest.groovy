package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
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
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class EnityDescriptorRepositoryTest extends Specification {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    @Autowired
    EntityManager entityManager

    OpenSamlObjects openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))

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
}
