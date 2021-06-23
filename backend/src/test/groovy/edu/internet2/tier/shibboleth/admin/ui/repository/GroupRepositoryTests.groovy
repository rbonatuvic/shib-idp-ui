package edu.internet2.tier.shibboleth.admin.ui.repository

import javax.persistence.EntityManager

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration

import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition
import edu.internet2.tier.shibboleth.admin.ui.domain.Group
import spock.lang.Specification

/**
 * Tests to validate the repo and model for groups
 * @author chasegawa
 */
@DataJpaTest
@ContextConfiguration(classes=[InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class GroupRepositoryTests extends Specification {
    @Autowired
    GroupRepository repo
    
    @Autowired
    EntityManager entityManager
    
    def "simple create test"() {
        given:
        def group = new Group().with {
            it.name = "group-name"
            it.description = "some description"
            it
        }

        // Confirm empty state
        when:
        def groups = repo.findAll()

        then:
        groups.size() == 0
        
        // save check
        when:
        repo.save(group)
        entityManager.flush()
        entityManager.clear()
        
        then:
        // save check
        def gList = repo.findAll()
        gList.size() == 1
        def groupFromDb = gList.get(0).asType(Group)
        groupFromDb.equals(group) == true
      
        // fetch checks
        repo.findByResourceId("not an id") == null
        repo.findByResourceId(groupFromDb.resourceId).equals(group)       
    }

    def "expected error"() {
        given:
        def group = new Group().with {
            it.description = "some description"
            it
        }

        // Confirm empty state
        when:
        def gList = repo.findAll()

        then:
        gList.size() == 0
        
        // save check
        when:
        repo.save(group)
        entityManager.flush()
        entityManager.clear()
        
        then:
        // Missing non-nullable field (name) should thrown error
        final def exception = thrown(javax.persistence.PersistenceException)
    }
        
    def "basic CRUD operations validated"() {
        given:
        def group = new Group().with {
            it.name = "group-name"
            it.description = "some description"
            it
        }

        // Confirm empty state
        when:
        def groups = repo.findAll()
        
        then:
        groups.size() == 0
                
        // save check
        when:
        repo.save(group)
        entityManager.flush()
        entityManager.clear()
        
        then:
        // save check
        def gList = repo.findAll()
        gList.size() == 1
        def groupFromDb = gList.get(0).asType(Group)
        groupFromDb.equals(group) == true
             
        // update check
        groupFromDb.with {
            it.description = "some new text that wasn't there before"
        }
        groupFromDb.equals(group) == false
        
        when:
        repo.save(groupFromDb)
        entityManager.flush()
        entityManager.clear()
        
        then:
        def gList2 = repo.findAll()
        gList2.size() == 1
        def groupFromDb2 = gList2.get(0).asType(Group)
        groupFromDb2.equals(group) == false
        groupFromDb2.equals(groupFromDb) == true
        
        // delete tests
        when:
        repo.delete(groupFromDb2)
        entityManager.flush()
        entityManager.clear()
        
        then:
        repo.findAll().size() == 0
    }
}