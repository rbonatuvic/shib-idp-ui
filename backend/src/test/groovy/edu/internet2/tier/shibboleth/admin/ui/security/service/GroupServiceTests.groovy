package edu.internet2.tier.shibboleth.admin.ui.security.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group
import org.springframework.test.annotation.Rollback

@Rollback
class GroupServiceTests extends AbstractBaseDataJpaTest {
    def "Test setting group regex works"() {
        given:
        Group g = new Group()
        g.setResourceId("twitter")
        g.setName("twitter")
        g.setValidationRegex(null)

        when:
        try {
            g = groupService.createGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == null

        when:
        g.setValidationRegex("/\\w\\b\\w/")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "/\\w\\b\\w/"

        when:
        g.setValidationRegex("/^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$/")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "/^(?:https?:\\/\\/)?(?:[^.]+\\.)?shib\\.org(\\/.*)?\$/"

        when:
        g.setValidationRegex("*")

        then:
        try {
            groupService.updateGroup(g)
            false
        } catch (InvalidGroupRegexException shouldOccur) {
            true
        }
    }

    def "Group regex evaluates properly" () {
        when:
        Group g = new Group()
        g.setResourceId("AAA")
        g.setName("AAA")
        g.setValidationRegex("/foo.*/")
        groupRepository.saveAndFlush(g)

        then:
        !groupService.doesStringMatchGroupPattern("AAA", "foobar")
        !groupService.doesStringMatchGroupPattern("AAA", "something")
        groupService.doesStringMatchGroupPattern("AAA", "/foobar/")

        when:
        g.setValidationRegex("foo.*")
        groupRepository.saveAndFlush(g)

        then:
        groupService.doesStringMatchGroupPattern("AAA", "foobar")
        !groupService.doesStringMatchGroupPattern("AAA", "something")
        groupService.doesStringMatchGroupPattern("AAA", "/foobar/")
    }

    def "CRUD operations - approver groups" () {
        given:
        groupService.clearAllForTesting()
        List<String> apprGroups = new ArrayList<>()
        String[] groupNames = ['AAA', 'BBB', 'CCC', 'DDD']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            groupRepository.save(group)
        }}
        entityManager.flush()
        entityManager.clear()

        when: "Adding approval list to a group"
        groupNames.each {name ->{
            if (!name.equals('AAA')) {
                apprGroups.add(name)
            }
        }}
        Approvers approvers = new Approvers()
        approvers.setApproverGroupIds(apprGroups)
        List<Approvers> apprList = new ArrayList<>()
        apprList.add(approvers)
        Group aaaGroup = groupService.find('AAA')
        aaaGroup.setApproversList(apprList)
        groupService.updateGroup(aaaGroup)

        then:
        def lookupGroup = groupService.find('AAA')
        lookupGroup.getApproversList().size() == 1
        def approvalGroups = lookupGroup.getApproversList().get(0).getApproverGroups()
        approvalGroups.size() == 3
        approvalGroups.each {group -> {
            assert apprGroups.contains(group.getResourceId())}
        }

        when: "removing approver group from existing list"
        approvers.setApproverGroupIds(Arrays.asList("CCC", "DDD"))
        apprList = new ArrayList<>()
        apprList.add(approvers)
        aaaGroup.setApproversList(apprList)
        groupService.updateGroup(aaaGroup)

        then:
        def lookupGroup2 = groupService.find('AAA')
        lookupGroup2.getApproversList().size() == 1
        def approvalGroups2 = lookupGroup2.getApproversList().get(0).getApproverGroups()
        approvalGroups2.size() == 2
        approvalGroups2.forEach(group -> group.getResourceId().equals("CCC") || group.getResourceId().equals("DDD"))

        when: "removing all approver groups"
        apprList = new ArrayList<>()
        aaaGroup.setApproversList(apprList)
        groupService.updateGroup(aaaGroup)

        then:
        def lookupGroup3 = groupService.find('AAA')
        lookupGroup3.getApproversList().isEmpty() == true
    }

}