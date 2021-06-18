package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.RoleRepository
import edu.internet2.tier.shibboleth.admin.ui.security.repository.UserRepository
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionService
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionServiceImpl

import javax.persistence.EntityManager

import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration

import spock.lang.Specification

/**
 * Tests for <code>edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration</code>
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, InternationalizationConfiguration, SearchConfiguration, edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class CustomPropertiesConfigurationTests extends Specification {

    @Autowired
    @Qualifier(value="customPropertiesConfiguration")
    CustomPropertiesConfiguration configUnderTest
    
    @Autowired
    CustomEntityAttributesDefinitionService ceadService
    
    @Autowired
    CustomEntityAttributeDefinitionRepository repository;
    
    @Autowired
    EntityManager entityManager

    def "Updating Custom Entity Attribute Definitions will update the CustomPropertiesConfiguration automatically"() {
        given: 'Test defaults loaded (ie no CEADs in DB)'

        expect:
        ceadService.getAllDefinitions().size() == 0
        configUnderTest.getOverrides().size() == 10
        
        def ca = new CustomEntityAttributeDefinition().with {
            it.name = "newDefName"
            it.attributeType = "STRING"
            it.defaultValue = "foobar"
            it
        }
        
        ceadService.createOrUpdateDefinition(ca)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 1
        configUnderTest.getOverrides().size() == 11
        
        def ca2 = new CustomEntityAttributeDefinition().with {
            it.name = "newDefName2"
            it.attributeType = "STRING"
            it.defaultValue = "foobar2"
            it
        }
        
        ceadService.createOrUpdateDefinition(ca2)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 2
        configUnderTest.getOverrides().size() == 12
        
        ceadService.deleteDefinition(ca)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 1
        configUnderTest.getOverrides().size() == 11
    }
}
