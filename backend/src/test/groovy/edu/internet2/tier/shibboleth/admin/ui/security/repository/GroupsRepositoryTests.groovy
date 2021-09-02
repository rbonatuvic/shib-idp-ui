package edu.internet2.tier.shibboleth.admin.ui.security.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager

/**
 * Tests to validate the repo and model for groups
 * @author chasegawa
 */
@Rollback
class GroupsRepositoryTests extends AbstractBaseDataJpaTest {
    @Autowired
    GroupsRepository groupsRepo

    @Transactional
    def setup() {
        groupsRepo.deleteAll()
        ownershipRepository.deleteAll()
        def ownerships = [
            new Ownership().with {
               it.ownedId = "aaa"
               it.ownedType = "USER"
               it.ownerId = "g1"
               it.ownerType = "GROUP"
               it
           },
           new Ownership().with {
              it.ownedId = "bbb"
              it.ownedType = "USER"
              it.ownerId = "g1"
              it.ownerType = "GROUP"
              it
          },
           new Ownership().with {
              it.ownedId = "ccc"
              it.ownedType = "USER"
              it.ownerId = "g1"
              it.ownerType = "GROUP"
              it
          },
           new Ownership().with {
              it.ownedId = "ccc"
              it.ownedType = "USER"
              it.ownerId = "g2"
              it.ownerType = "GROUP"
              it
          },
          new Ownership().with {
              it.ownedId = "bbb"
              it.ownedType = "ENTITY_DESCRIPTOR"
              it.ownerId = "aaa"
              it.ownerType = "GROUP"
              it
          },
           new Ownership().with {
              it.ownedId = "aaa"
              it.ownedType = "ENTITY_DESCRIPTOR"
              it.ownerId = "aaa"
              it.ownerType = "USER"
              it
          }
       ]
       ownerships.each {
           ownershipRepository.save(it)
       }
    }

    def "group ownership tests"() {
        when: "Simple create test"
        def group = new Group().with {
            it.name = "group 1"
            it.description = "some description"
            it.resourceId = "g1"
            it
        }
        Group savedGroup = groupsRepo.saveAndFlush(group)
        Collection all = ownershipRepository.findAllByOwner(savedGroup)
        
        then:
        all.size() == 3
        savedGroup.getOwnedItems().size() == 3
        all.each {
            savedGroup.ownedItems.contains(it)
        }
    }
    
    def "simple create test"() {
        given:
        def group = new Group().with {
            it.name = "group-name"
            it.description = "some description"
            it
        }

        // Confirm empty state
        when:
        def groups = groupsRepo.findAll()

        then:
        groups.size() == 0
        
        // save check
        when:
        group = groupsRepo.save(group)
        
        then:
        // save check
        def gList = groupsRepo.findAll()
        gList.size() == 1
        def groupFromDb = gList.get(0) as Group
        groupFromDb == group
      
        // fetch checks
        groupsRepo.findByResourceId("not an id") == null
        groupsRepo.findByResourceId(groupFromDb.resourceId) == group
    }

    def "expected error"() {
        given:
        def group = new Group().with {
            it.description = "some description"
            it
        }

        // Confirm empty state
        when:
        def gList = groupsRepo.findAll()

        then:
        gList.isEmpty()
        
        // save check
        when:
        groupsRepo.save(group)
        
        then:
        // Missing non-nullable field (name) should thrown error
        thrown(DataIntegrityViolationException)
        entityManager.clear()
        groupsRepo.findAll().isEmpty()
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
        def groups = groupsRepo.findAll()
        
        then:
        groups.size() == 0
                
        // save check
        when:
        groupsRepo.save(group)
        
        then:
        // save check
        def gList = groupsRepo.findAll()
        gList.size() == 1
        def groupFromDb = gList.get(0) as Group
        groupFromDb == group
             
        // update check
        groupFromDb.with {
            it.description = "some new text that wasn't there before"
        }
        groupFromDb.equals(group) == false
        
        when:
        groupsRepo.save(groupFromDb)
        
        then:
        def gList2 = groupsRepo.findAll()
        gList2.size() == 1
        def groupFromDb2 = gList2.get(0) as Group
        groupFromDb2.equals(group) == false
        groupFromDb2 == groupFromDb
        
        // delete tests
        when:
        groupsRepo.delete(groupFromDb2)
       
        then:
        groupsRepo.findAll().isEmpty()
        
        when:
        def nothingThere = groupsRepo.findByResourceId(null)
        
        then:
        nothingThere == null
    }
}