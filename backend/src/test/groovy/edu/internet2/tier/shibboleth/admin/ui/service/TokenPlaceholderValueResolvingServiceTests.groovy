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

    def setup() {
        def propPairs = ["idp.home=$IDP_HOME".toString(), "refresh.interval=$REFRESH_INTERVAL".toString()]
        TestPropertyValues.of(propPairs).applyTo(environment)
    }

    def "resolves correctly existing properties from well-formed shibboleth idp style placeholder tokens: %{}"() {
        when: 'Valid placeholder token is passed for which property values are defined'
        def idpHome = serviceUnderTest.resolveValueFromTokenPlaceholder('%{idp.home}')
        def refreshInterval = serviceUnderTest.resolveValueFromTokenPlaceholder('%{refresh.interval}')

        then: 'Correct property value resolution is performed'
        idpHome == IDP_HOME
        refreshInterval == REFRESH_INTERVAL
    }
}
