package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntityIdsSearchServiceTests extends Specification {

    @Autowired
    EntityIdsSearchService entityIdsSearchService

    def "searching for carmen produces one result"() {
        setup:
        def searchTerm = "carmen"
        def searchLimit = 10
        def expectedResultSize = 1
        def expectedResultItem = "https://carmenwiki.osu.edu/shibboleth"

        when:
        def actualResults = entityIdsSearchService.findBySearchTermAndOptionalLimit(searchTerm, searchLimit)

        then:
        expectedResultSize == actualResults.entityIds.size()
        expectedResultItem == actualResults.entityIds.get(0)
    }

    def "searching for unicon produces two results"() {
        setup:
        def searchTerm = "unicon"
        def searchLimit = 10
        def expectedResultSize = 2
        def expectedResults = Arrays.asList(["http://unicon.instructure.com/saml2", "https://idp.unicon.net/idp/shibboleth"])

        when:
        def actualResults = entityIdsSearchService.findBySearchTermAndOptionalLimit(searchTerm, searchLimit)

        then:
        expectedResultSize == actualResults.entityIds.size()
        expectedResults.forEach { url -> actualResults.entityIds.contains(url) }
    }

    def "searching for an empty string produces an empty result"() {
        setup:
        def searchTerm = ""
        def searchLimit = 10
        def expectedResultSize = 0

        when:
        def actualResults = entityIdsSearchService.findBySearchTermAndOptionalLimit(searchTerm, searchLimit)

        then:
        expectedResultSize == actualResults.entityIds.size()
    }

    def "searching for unicon with a size limit of 1 produces one result"() {
        setup:
        def searchTerm = "unicon"
        def searchLimit = 1
        def expectedResultSize = 1
        def expectedResults = Arrays.asList(["http://unicon.instructure.com/saml2"])

        when:
        def actualResults = entityIdsSearchService.findBySearchTermAndOptionalLimit(searchTerm, searchLimit)

        then:
        expectedResultSize == actualResults.entityIds.size()
        expectedResults.forEach { url -> actualResults.entityIds.contains(url) }
    }

    def "searching for anything with a size limit of 0 produces an IllegalArgumentException"() {
        setup:
        def searchTerm = "anything"
        def searchLimit = 0

        when:
        entityIdsSearchService.findBySearchTermAndOptionalLimit(searchTerm, searchLimit)

        then:
        thrown IllegalArgumentException
    }
}