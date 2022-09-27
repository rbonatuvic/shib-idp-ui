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
        groupService.clearAllForTesting();
        HashSet<Group> apprGroups = new HashSet<>()
        String[] groupNames = ['AAA', 'BBB', 'CCC', 'DDD']
        groupNames.each {name -> {
            Group group = new Group().with({
                it.name = name
                it.description = name
                it.resourceId = name
                it
            })
            group = groupRepository.saveAndFlush(group)
            if (!name.equals('AAA')) {
                apprGroups.add(group)
            }
        }}

        when: "Adding approval list to a group"
        Approvers approvers = new Approvers()
        approvers.setApproverGroups(apprGroups)
        List<Approvers> apprList = new ArrayList<>()
        apprList.add(approvers)
        Group aaaGroup = groupService.find('AAA')
        aaaGroup.setApprovalGroups(apprList)
        groupService.updateGroup(aaaGroup)
        Group lookupGroup = groupService.find('AAA')

        then:
        lookupGroup.getApprovalGroups().size() == 1
    }

}