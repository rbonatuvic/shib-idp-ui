package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.util.TestPropertyValues
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification
import spock.lang.Subject

/**
 * @author Dmitriy Kopylenko
 */
@ContextConfiguration(classes = [PlaceholderResolverComponentsConfiguration])
class TokenPlaceholderValueResolvingServiceTests extends Specification {

    @Autowired
    @Subject
    TokenPlaceholderValueResolvingService serviceUnderTest

    @Autowired
    ConfigurableEnvironment environment

    static final IDP_HOME = '/tmp/test/idp'
    static final REFRESH_INTERVAL = 'PT5M'
    static final PLAIN_VALUE = 'Plain String value'

    def setup() {
        def propPairs = ["idp.home=$IDP_HOME".toString(), "refresh.interval=$REFRESH_INTERVAL".toString()]
        TestPropertyValues.of(propPairs).applyTo(environment)
    }

    def "resolves correctly existing properties from well-formed shibboleth idp style placeholder tokens: %{}"() {
        when: 'Valid placeholder token is passed in for which property values are defined'
        def idpHome = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder('%{idp.home}')
        def refreshInterval = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder('%{refresh.interval}')

        then: 'Correct property value resolution is performed'
        idpHome == IDP_HOME
        refreshInterval == REFRESH_INTERVAL
    }

    def "returns value as is if no well-formed shibboleth idp style placeholder tokens: %{} are passed in"() {
        when: 'Plain value without placeholder token is passed in'
        def idpHome = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder(IDP_HOME)
        def plainValue = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder(PLAIN_VALUE)

        then: 'Value returned as is'
        idpHome == IDP_HOME
        plainValue == PLAIN_VALUE

        when: 'Malformed placeholder value is passed in'
        plainValue = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder('%{malformed.value')

        then:
        plainValue == '%{malformed.value'
    }

    def "Throws IllegalArgumentException for unresolvable properties"() {
        when: 'Valid placeholder token is passed in for which property values are undefined'
        serviceUnderTest.resolveValueFromPossibleTokenPlaceholder("%{i.am.not.defined}")

        then:
        thrown IllegalArgumentException

        when: 'Combination of resolvable and unresolvable tokens are passed in'
        serviceUnderTest.resolveValueFromPossibleTokenPlaceholder("%{idp.home}/%{i.am.not.defined}")

        then:
        thrown IllegalArgumentException
    }

    def "resolves correctly combination of existing properties from well-formed shibboleth idp style placeholder tokens: %{}"() {
        when: 'Valid placeholder token is passed in for which property values are defined'
        def combinedValue = serviceUnderTest.resolveValueFromPossibleTokenPlaceholder('%{idp.home} AND %{refresh.interval}')

        then: 'Correct combined property values resolution is performed'
        combinedValue == "$IDP_HOME AND $REFRESH_INTERVAL"
    }
}