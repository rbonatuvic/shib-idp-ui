package edu.internet2.tier.shibboleth.admin.ui.security.repository

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.Rollback
import org.springframework.test.context.ContextConfiguration
import org.springframework.transaction.annotation.Transactional

import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnableType
import edu.internet2.tier.shibboleth.admin.ui.security.model.Owner
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnerType
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import spock.lang.Specification

/**
 * Tests to validate the repo and model for groups
 * @author chasegawa
 */
@DataJpaTest
@ContextConfiguration(classes=[InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class OwnershipRepositoryTests extends Specification {
    @Autowired
    OwnershipRepository repo
    
    @Transactional
    def setup() {
        repo.deleteAll()
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
           repo.save(it)
       }
    }
    
    @Rollback
    def "test clearUsersGroups"() {
        when: "remove entries where the user is the owned object of a group"
        repo.clearUsersGroups("aaa")
        def result = repo.findAllGroupsForUser("aaa")
        
        then:
        result.size() == 0
        
        when: "find objects owned by user aaa has not changed"
        result = repo.findOwnedByUser("aaa")
        
        then:
        result.size() == 1
        result.each {
            it.ownerId == "aaa"
            it.ownerType == "USER"
            it.ownedId == "aaa"
            it.ownedType == "ENTITY_DESCRIPTOR"
        }
        
        when: "remove entries where the user is the owned object of groups"
        repo.clearUsersGroups("ccc")
        result = repo.findAllGroupsForUser("ccc")
        
        then:
        result.size() == 0
    }

    @Rollback
    def "test deleteEntriesForOwnedObject"() {
        when: "remove entries where the user is the owned object of a group"
        repo.deleteEntriesForOwnedObject(new Ownable() {
                String getObjectId() { return "aaa"  }
    
                OwnableType getOwnableType() { OwnableType.USER }
            })
        def result = repo.findAllGroupsForUser("aaa")
        
        then:
        result.size() == 0
        
        when: "find objects owned by user aaa has not changed"
        result = repo.findOwnedByUser("aaa")
        
        then:
        result.size() == 1
        result.each {
            it.ownerId == "aaa"
            it.ownerType == "USER"
            it.ownedId == "aaa"
            it.ownedType == "ENTITY_DESCRIPTOR"
        }
        
        when: "remove entries where the user is the owned object of groups"
        repo.deleteEntriesForOwnedObject(new Ownable() {
                String getObjectId() { return "ccc"  }
    
                OwnableType getOwnableType() { OwnableType.USER }
            })
        result = repo.findAllGroupsForUser("ccc")
        
        then:
        result.size() == 0
    }
        
    def "test findUsersByOwner"() {
        when: "find all the users owned by group g1"
        ArrayList<String> userIds = new ArrayList<>()
        userIds.add("aaa")
        userIds.add("bbb")
        userIds.add("ccc")
        def result = repo.findUsersByOwner(new Owner() {
            String getOwnerId() { return "g1" }
            
            OwnerType getOwnerType() { OwnerType.GROUP }
        })
        
        then:
        result.size() == 3
        result.each {
            userIds.contains(it.getOwnedId())
            it.ownedType == "USER"
        }
        
        when:
        result = repo.findUsersByOwner(new Owner() {
            String getOwnerId() { return "aaa" }
            
            OwnerType getOwnerType() { return OwnerType.USER }
        })
        
        then:
        result.size() == 0
    }
    
    def "test findOwnedByUser"() {
        when: "find objects owned by user"
        def result = repo.findOwnedByUser("aaa")
        
        then:
        result.size() == 1
        result.each {
            it.ownerId == "aaa"
            it.ownerType == "USER"
            it.ownedId == "aaa"
            it.ownedType == "ENTITY_DESCRIPTOR"
        }
    }
    
    def "test findOwnableObjectOwners"() {
        when: "find owners for OWNABLE"
        ArrayList<String> groupIds = new ArrayList<>()
        groupIds.add("g1")
        groupIds.add("g2")
        def result = repo.findOwnableObjectOwners(new Ownable() {
            String getObjectId() { return "ccc" }
            OwnableType getOwnableType() { return OwnableType.USER }
        })
        
        then:
        result.size() == 2
        result.each {
            it.ownerType == "GROUP"
            it.ownedId == "ccc"
            groupIds.contains(it.getOwnedId())
        }
    }
    
    def "test findAllGroupsForUser"() {
        when: "find all groups for user aaa"
        def result = repo.findAllGroupsForUser("aaa")
        
        then:
        result.size() == 1
        result.each {
            it.ownedId == "g1"
            it.ownedType == "GROUP"
        }
        
        when: "find all groups for user ccc"
        ArrayList<String> groupIds = new ArrayList<>()
        groupIds.add("g1")
        groupIds.add("g2")
        result = repo.findAllGroupsForUser("ccc")
        
        then:
        result.size() == 2
        result.each {
            it.ownerType == "GROUP"
            it.ownedId == "ccc"
            groupIds.contains(it.getOwnedId())
        }
    }
    
    def "test findAllByOwner" () {
        when: "Find all for group g1"
        ArrayList<String> userIds = new ArrayList()
        userIds.add("aaa")
        userIds.add("bbb")
        userIds.add("ccc")
        def result = repo.findAllByOwner(new Owner() {
            String getOwnerId() { return "g1" }
            
            OwnerType getOwnerType() { return OwnerType.GROUP }
        })
        
        then: 
        result.size() == 3
        result.each {
            userIds.contains(it.getOwnedId())
            it.ownedType == "USER"
        }
        
        when: "Find all items owned by user aaa"
        result = repo.findAllByOwner(new Owner() {
            String getOwnerId() { return "aaa" }
            
            OwnerType getOwnerType() { return OwnerType.USER }
        })
        
        then:
        result.size() == 1
        result.each {
            it.ownerId == "aaa"
            it.ownerType == "USER"
            it.ownedId == "aaa"
            it.ownedType == "ENTITY_DESCRIPTOR"
        }
    }
}