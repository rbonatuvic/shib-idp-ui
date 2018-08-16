package edu.internet2.tier.shibboleth.admin.ui.domain.filters

import spock.lang.Specification
import spock.lang.Subject

/**
 * @author Dmitriy Kopylenko
 */
class SignatureValidationFilterTests extends Specification {

    def "correct logic in xmlShouldBeGenerated() method"() {
        given: "filter under test with requireSignedRoot set to false"
        @Subject
        def filter = new SignatureValidationFilter(requireSignedRoot: false)

        expect:
        !filter.xmlShouldBeGenerated()

        when: "filter under test with requireSignedRoot set to true"
        filter.requireSignedRoot = true

        then:
        filter.xmlShouldBeGenerated()

    }
}
