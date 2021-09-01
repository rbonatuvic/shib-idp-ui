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
        g.getValidationRegex() == Group.DEFAULT_REGEX

        when:
        g.setValidationRegex("/*")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "/*"

        when:
        g.setValidationRegex("^(http:\\\\/\\\\/www\\\\.|https:\\\\/\\\\/www\\\\.|http:\\\\/\\\\/|https:\\\\/\\\\/)?[a-z0-9]+([\\\\-\\\\.]twitter+)\\\\.[a-z]{2,5}(:[0-9]{1,5})?(\\\\/.*)?\\\$")
        try {
            g = groupService.updateGroup(g)
        } catch (Exception shouldNotOccur) {
            false
        }

        then:
        g.getValidationRegex() == "^(http:\\\\/\\\\/www\\\\.|https:\\\\/\\\\/www\\\\.|http:\\\\/\\\\/|https:\\\\/\\\\/)?[a-z0-9]+([\\\\-\\\\.]twitter+)\\\\.[a-z]{2,5}(:[0-9]{1,5})?(\\\\/.*)?\\\$"

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