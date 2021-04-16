package edu.internet2.tier.shibboleth.admin.ui.repository

import javax.persistence.EntityManager

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration

import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomAttributeDefinition
import spock.lang.Specification

/**
 * Tests to validate the repo and model for custom entity attributes
 * @author chasegawa
 */
@DataJpaTest
@ContextConfiguration(classes=[InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class CustomAttributeRepositoryTests extends Specification {

    @Autowired
    CustomAttributeRepository repo
    
    @Autowired
    EntityManager entityManager
    
    def "basic CRUD operations validated"() {
        given:
        def setItems = new HashSet<String>(["val1", "val2", "val3"])
        def ca = new CustomAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems
            it
        }

        // Confirm empty state
        when:
        def atts = repo.findAll()

        then:
        atts.size() == 0
        
        // save check
        when:
        repo.save(ca)
        entityManager.flush()
        entityManager.clear()
        
        then:
        // save check
        def cas = repo.findAll()
        cas.size() == 1
        def caFromDb1 = cas.get(0).asType(CustomAttributeDefinition)
        caFromDb1.equals(ca) == true
      
        // fetch checks
        repo.findByName("not a name") == null
        repo.findByName("ca-name").equals(ca)
        
        // update check
        caFromDb1.with {
            it.helpText = "some new text that wasn't there before"
        }
        caFromDb1.equals(ca) == false
        
        when:
        repo.save(caFromDb1)
        entityManager.flush()
        entityManager.clear()
        
        then:
        def cas2 = repo.findAll()
        cas2.size() == 1
        def caFromDb2 = cas2.get(0).asType(CustomAttributeDefinition)
        caFromDb2.equals(ca) == false
        caFromDb2.equals(caFromDb1) == true
        
        // delete tests
        when:
        def delByName = new CustomAttributeDefinition().with {
            it.name = "ca-name"
            it
        }
        repo.delete(delByName)
        entityManager.flush()
        entityManager.clear()
        
        then:
        repo.findAll().size() == 0
    }
    
    def "attribute list tests"() {
        given:
        def setItems2 = new HashSet<String>(["val2", "val1"])
        def setItems3 = new HashSet<String>(["val1", "val2", "val3"])
        def setItems4 = new HashSet<String>(["val1", "val2", "val3", "val4"])
        def ca2 = new CustomAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems2
            it
        }
        def ca3 = new CustomAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems3
            it
        }        
        def ca4 = new CustomAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems4
            it
        }
        
        when:
        repo.save(ca3)
        entityManager.flush()
        entityManager.clear()
        
        then:
        def cas = repo.findAll()
        cas.size() == 1
        def caFromDb = cas.get(0).asType(CustomAttributeDefinition)
        caFromDb.equals(ca3) == true
        
        // now update the attribute list items
        caFromDb.with { 
            it.customAttrListDefinitions = setItems4
            it
        }
        repo.save(caFromDb)
        entityManager.flush()
        entityManager.clear()
        
        def caFromDb4 = repo.findAll().get(0).asType(CustomAttributeDefinition)
        caFromDb4.equals(ca4) == true
        
        // now remove items
        caFromDb.with {
            it.customAttrListDefinitions = setItems2
            it
        }
        repo.save(caFromDb)
        entityManager.flush()
        entityManager.clear()
        
        def caFromDb2 = repo.findAll().get(0).asType(CustomAttributeDefinition)
        caFromDb2.equals(ca2) == true
    }
}