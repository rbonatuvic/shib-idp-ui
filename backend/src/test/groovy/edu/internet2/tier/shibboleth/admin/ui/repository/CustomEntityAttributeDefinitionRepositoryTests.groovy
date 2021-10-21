package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException

import javax.persistence.EntityManager

/**
 * Tests to validate the repo and model for custom entity attributes
 * @author chasegawa
 */
class CustomEntityAttributeDefinitionRepositoryTests extends AbstractBaseDataJpaTest {
    @Autowired
    CustomEntityAttributeDefinitionRepository repo
    
    @Autowired
    EntityManager entityManager
    
    def "simple create test"() {
        given:
        def ca = new CustomEntityAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "STRING"
            it.defaultValue = "foo"
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
        def caFromDb1 = cas.get(0).asType(CustomEntityAttributeDefinition)
        caFromDb1.equals(ca)
      
        // fetch checks
        repo.findByName("not a name") == null
        repo.findByName("ca-name").equals(ca)       
    }

    def "expected error"() {
        given:
        def ca = new CustomEntityAttributeDefinition().with {
            it.name = "ca-name"
            it.defaultValue = "foo"
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
        // Missing non-nullable field should thrown error
        thrown(DataIntegrityViolationException)
    }
        
    def "basic CRUD operations validated"() {
        given:
        def setItems = new HashSet<String>(["val1", "val2", "val3"])
        def ca = new CustomEntityAttributeDefinition().with {
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
        def caFromDb1 = cas.get(0).asType(CustomEntityAttributeDefinition)
        caFromDb1 == ca
      
        // fetch checks
        repo.findByName("not a name") == null
        repo.findByName("ca-name").equals(ca)
        
        // update check
        caFromDb1.with {
            it.helpText = "some new text that wasn't there before"
        }
        caFromDb1 != ca
        
        when:
        repo.save(caFromDb1)
        entityManager.flush()
        entityManager.clear()
        
        then:
        def cas2 = repo.findAll()
        cas2.size() == 1
        def caFromDb2 = cas2.get(0).asType(CustomEntityAttributeDefinition)
        caFromDb2 != ca
        caFromDb2 == caFromDb1
        
        // delete tests
        when:
        repo.delete(caFromDb1)
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
        def ca3 = new CustomEntityAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems3
            it
        }        
        
        when:
        repo.save(ca3)
        entityManager.flush()
        entityManager.clear()
        
        then:
        def cas = repo.findAll()
        cas.size() == 1
        def ca3FromDb = cas.get(0).asType(CustomEntityAttributeDefinition)
        ca3FromDb == ca3
        
        // now update the attribute list items
        ca3FromDb.with { 
            it.customAttrListDefinitions = setItems4
            it
        }
        repo.save(ca3FromDb)
        entityManager.flush()
        entityManager.clear()
        
        def caFromDb4 = repo.findAll().get(0).asType(CustomEntityAttributeDefinition)
        def ca4 = new CustomEntityAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "SELECTION_LIST"
            it.customAttrListDefinitions = setItems4
            it.resourceId = ca3FromDb.resourceId
            it
        }
        caFromDb4 == ca4
        
        // now remove items
        ca3FromDb.with {
            it.customAttrListDefinitions = setItems2
            it
        }
        repo.save(ca3FromDb)
        entityManager.flush()
        entityManager.clear()
        
        def caFromDb2 = repo.findAll().get(0).asType(CustomEntityAttributeDefinition)
        ca3FromDb.resourceId == caFromDb2.resourceId
        ca3FromDb.customAttrListDefinitions.equals(caFromDb2.customAttrListDefinitions)
    }
}