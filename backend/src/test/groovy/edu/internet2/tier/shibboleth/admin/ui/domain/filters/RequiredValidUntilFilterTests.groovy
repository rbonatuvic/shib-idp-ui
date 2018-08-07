package edu.internet2.tier.shibboleth.admin.ui.domain.filters

import spock.lang.Specification
import spock.lang.Subject

/**
 * @author Dmitriy Kopylenko
 */
class RequiredValidUntilFilterTests extends Specification {

    def "correct logic in xmlShouldBeGenerated() method"() {
        given: "filter under test with maxValidityInterval property not set (null)"
        @Subject
        def filter = new RequiredValidUntilFilter()

        expect:
        !filter.xmlShouldBeGenerated()

        when: "filter under test with maxValidityInterval property not set to PT0S"
        filter.maxValidityInterval = 'PT0S'

        then:
        !filter.xmlShouldBeGenerated()

        when: "filter under test with maxValidityInterval property not set to some other valid value"
        filter.maxValidityInterval = 'PT30S'

        then:
        filter.xmlShouldBeGenerated()

    }
}
