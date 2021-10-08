package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml

import org.opensaml.saml.metadata.resolver.impl.AbstractDynamicMetadataResolver
import spock.lang.Specification

//TODO: we need to fill this out
class OpenSamlMetadataResolverConstructorHelperSpec extends Specification {
    def "SHIBUI-2163: make sure that we don't get a NPE if attributes are null"() {
        given:
        def x = Mock(AbstractDynamicMetadataResolver)

        when:
        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(
                x,
                null,
                null
        )

        then:
        noExceptionThrown()
    }
}
