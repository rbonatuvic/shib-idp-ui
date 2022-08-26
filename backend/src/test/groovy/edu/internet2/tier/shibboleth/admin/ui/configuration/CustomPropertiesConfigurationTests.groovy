package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition
import edu.internet2.tier.shibboleth.admin.ui.repository.CustomEntityAttributeDefinitionRepository
import edu.internet2.tier.shibboleth.admin.ui.service.CustomEntityAttributesDefinitionService
import org.springframework.beans.factory.annotation.Autowired

/**
 * Tests for <code>edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration</code>
 */
class CustomPropertiesConfigurationTests extends AbstractBaseDataJpaTest {

    @Autowired
    CustomPropertiesConfiguration configUnderTest
    
    @Autowired
    CustomEntityAttributesDefinitionService ceadService
    
    @Autowired
    CustomEntityAttributeDefinitionRepository repository

    def "Updating Custom Entity Attribute Definitions will update the CustomPropertiesConfiguration automatically"() {
        given: 'Test defaults loaded (ie no CEADs in DB)'

        expect:
        ceadService.getAllDefinitions().size() == 0
        configUnderTest.getOverrides().size() == 11
        
        def ca = new CustomEntityAttributeDefinition().with {
            it.name = "newDefName"
            it.attributeType = "STRING"
            it.defaultValue = "foobar"
            it
        }
        
        ceadService.createOrUpdateDefinition(ca)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 1
        configUnderTest.getOverrides().size() == 12
        
        def ca2 = new CustomEntityAttributeDefinition().with {
            it.name = "newDefName2"
            it.attributeType = "STRING"
            it.defaultValue = "foobar2"
            it
        }
        
        ceadService.createOrUpdateDefinition(ca2)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 2
        configUnderTest.getOverrides().size() == 13
        
        ceadService.deleteDefinition(ca)
        entityManager.flush()
        
        ceadService.getAllDefinitions().size() == 1
        configUnderTest.getOverrides().size() == 12
    }
}