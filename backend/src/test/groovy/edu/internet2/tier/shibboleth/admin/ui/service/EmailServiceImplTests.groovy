package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.DevConfig
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.auto.EmailConfiguration
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.env.Environment
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import spock.lang.Ignore
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest
//@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, EmailConfiguration, TestConfiguration, InternationalizationConfiguration, SearchConfiguration, DevConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles(["no-auth", "dev"])
class EmailServiceImplTests extends Specification {

    @Autowired
    EmailService emailService

    @Autowired
    Environment env

    JsonSlurper jsonSlurper = new JsonSlurper()

    // Ignoring until we can figure out how to get this to pass on Jenkins
    @Ignore
    def "emailService can successfully send an email"() {
        given:

        def mailhogHost = 'localhost'
        def mailhogPort = '8025'

        def newUserName = 'foobar'
        def expectedToAddresses = emailService.systemAdminEmailAddresses
        def expectedFromAddress = env.getProperty('shibui.mail.system-email-address')
        def expectedNewUserEmailSubject = "User Access Request for ${newUserName}"
        def expectedTextEmailBody = new File(this.class.getResource('/mail/text/new-user.txt').toURI()).text

        when:
        emailService.sendNewUserMail("foobar")
        def getEmailsURL = new URL("http://${mailhogHost}:${mailhogPort}/api/v2/messages")
        def resultJson = jsonSlurper.parse(getEmailsURL)
        println(JsonOutput.prettyPrint(JsonOutput.toJson(resultJson)))

        then:
        // There's a bunch of other noise in here that changes per email
        resultJson.total == 1
        expectedToAddresses.size() == resultJson.items[0].To.size()
        expectedToAddresses.join(', ') == resultJson.items[0].Content.Headers.To[0]
        expectedFromAddress == resultJson.items[0].From.Mailbox + '@' + resultJson.items[0].From.Domain
        expectedNewUserEmailSubject == resultJson.items[0].Content.Headers.Subject[0]
        resultJson.items[0].Content.Body.contains(expectedTextEmailBody)
    }
}