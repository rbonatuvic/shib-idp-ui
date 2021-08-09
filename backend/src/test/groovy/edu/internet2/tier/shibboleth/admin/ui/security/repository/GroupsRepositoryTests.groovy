package edu.internet2.tier.shibboleth.admin.ui.security.repository

import javax.persistence.EntityManager
import javax.transaction.Transactional

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration

import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener
import spock.lang.Specification

/**
 * Tests to validate the repo and model for groups
 * @author chasegawa
 */
@DataJpaTest
@ContextConfiguration(classes=[InternationalizationConfiguration, LocalConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles("test")
class GroupsRepositoryTests extends Specification {
    @Autowired
    GroupsRepository groupsRepo
    
    @Autowired
    OwnershipRepository ownershipRepository
    
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
        def Group savedGroup = groupsRepo.saveAndFlush(group)
        def Collection all = ownershipRepository.findAllByOwner(savedGroup)
        
        then:
        all.size() == 3
        savedGroup.ownedItems.size() == 3
        all.each {
            savedGroup.ownedItems.contains(it)
        }
    }
    
    @Rollback
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
        def groupFromDb = gList.get(0).asType(Group)
        groupFromDb.equals(group) == true
      
        // fetch checks
        groupsRepo.findByResourceId("not an id") == null
        groupsRepo.findByResourceId(groupFromDb.resourceId).equals(group)       
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
        gList.size() == 0
        
        // save check
        when:
        def savedGroup = groupsRepo.save(group)
        
        then:
        // Missing non-nullable field (name) should thrown error
        final def exception = thrown(org.springframework.dao.DataIntegrityViolationException)
    }
    
    @Rollback
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
        def groupFromDb = gList.get(0).asType(Group)
        groupFromDb.equals(group) == true
             
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
        def groupFromDb2 = gList2.get(0).asType(Group)
        groupFromDb2.equals(group) == false
        groupFromDb2.equals(groupFromDb) == true
        
        // delete tests
        when:
        groupsRepo.delete(groupFromDb2)
       
        then:
        groupsRepo.findAll().size() == 0
        
        when:
        def nothingThere = groupsRepo.findByResourceId(null);
        
        then:
        nothingThere == null
    }
    
    @org.springframework.boot.test.context.TestConfiguration
    static class LocalConfig {
        @Bean
        GroupUpdatedEntityListener groupUpdatedEntityListener(OwnershipRepository repo) {
            GroupUpdatedEntityListener result = new GroupUpdatedEntityListener()
            result.init(repo)
            return result            
        }
    }
}