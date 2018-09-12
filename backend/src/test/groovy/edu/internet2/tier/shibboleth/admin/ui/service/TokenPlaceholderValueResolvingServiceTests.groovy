package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification
import spock.lang.Subject

@ContextConfiguration(classes=[PlaceholderResolverComponentsConfiguration])
class TokenPlaceholderValueResolvingServiceTests extends Specification {

    @Autowired
    @Subject
    TokenPlaceholderValueResolvingService placeholderValueResolvingService

    def "resolves correctly existing properties from well-formed shibboleth idp style placeholder tokens: %{}"() {
        when:
        def idpHome = placeholderValueResolvingService.resolveValueFromTokenPlaceholder('%{idp.home}')

        then:
        idpHome
    }


}
