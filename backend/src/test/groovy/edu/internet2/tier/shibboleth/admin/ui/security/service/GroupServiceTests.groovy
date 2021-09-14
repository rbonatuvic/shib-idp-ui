package edu.internet2.tier.shibboleth.admin.ui.security.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.security.exception.InvalidGroupRegexException
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
}