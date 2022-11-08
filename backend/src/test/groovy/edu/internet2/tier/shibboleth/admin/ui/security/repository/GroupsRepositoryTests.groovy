package edu.internet2.tier.shibboleth.admin.ui.security.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.test.annotation.Rollback
import org.springframework.transaction.annotation.Transactional

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
        groupsRepo.saveAndFlush(group)
        entityManager.clear()
        Group groupFromDb = groupsRepo.findByResourceId("g1")
        groupFromDb.getOwnedItems()
        Collection groupOwnedItems = ownershipRepository.findAllByOwner(groupFromDb)
        
        then:
        groupOwnedItems.size() == 3
        groupFromDb.getOwnedItems().size() == 3
        groupOwnedItems.each {
            groupFromDb.ownedItems.contains(it)
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
             
        // update check - equality for groups should be by id
        groupFromDb.with {
            it.description = "some new text that wasn't there before"
        }
        groupFromDb.equals(group) == true
        
        when:
        groupsRepo.save(groupFromDb)
        
        then:
        def gList2 = groupsRepo.findAll()
        gList2.size() == 1
        def groupFromDb2 = gList2.get(0) as Group
        groupFromDb2.equals(group) == true
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

    def "get list of groups that a group can approve for"() {
        when:
        groupService.clearAllForTesting()
        List<Group> apprGroups = new ArrayList<>()
        String[] groupNames = ['BBB', 'CCC', 'EEE', 'AAA']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            if (name != "AAA") {
                apprGroups.add(groupRepository.save(group))
            } else {
                Approvers approvers = new Approvers()
                approvers.setApproverGroups(apprGroups)
                List<Approvers> apprList = new ArrayList<>()
                apprList.add(approversRepository.save(approvers))
                group.setApproversList(apprList)
                groupRepository.save(group)
            }
        }}
        Group group = new Group().with({
            it.name = 'DDD'
            it.description = 'DDD'
            it.resourceId = 'DDD'
            it
        })
        Approvers approvers = new Approvers()
        apprGroups = new ArrayList<>()
        apprGroups.add(groupRepository.findByResourceId('BBB'))
        approvers.setApproverGroups(apprGroups)
        List<Approvers> apprList = new ArrayList<>()
        apprList.add(approversRepository.save(approvers))
        group.setApproversList(apprList)
        groupRepository.save(group)
        entityManager.flush()
        entityManager.clear()

        then:
        def result = groupRepository.getGroupIdsOfGroupsToApproveFor('BBB')
        result.size() == 2
        result.contains('AAA')
        result.contains('DDD')
        groupRepository.findAllGroupIds().size() == 6
    }
}