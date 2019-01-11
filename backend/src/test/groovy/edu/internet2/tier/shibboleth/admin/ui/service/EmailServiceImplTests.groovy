package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.DevConfig
import edu.internet2.tier.shibboleth.admin.ui.configuration.EmailConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@SpringBootTest
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, EmailConfiguration, TestConfiguration, InternationalizationConfiguration, SearchConfiguration, DevConfig])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ActiveProfiles(["no-auth", "dev"])
class EmailServiceImplTests extends Specification {

    @Autowired
    EmailService emailService

    def "emailService can successfully send an email"() {
        when:
        emailService.sendNewUserMail("foobar")

        then:
        noExceptionThrown()
    }
}
