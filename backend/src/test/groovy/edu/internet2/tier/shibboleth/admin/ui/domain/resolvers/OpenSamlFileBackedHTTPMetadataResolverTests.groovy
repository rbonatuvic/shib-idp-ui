package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFileBackedHTTPMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.service.TokenPlaceholderValueResolvingService
import edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers
import org.springframework.core.env.MutablePropertySources
import spock.lang.Specification

class OpenSamlFileBackedHTTPMetadataResolverTests extends Specification {
    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def "test refresh"() {
        when:
        new TokenPlaceholderResolvers(TokenPlaceholderValueResolvingService.shibbolethPlaceholderPrefixAware(new MutablePropertySources()))
        def fbhmr = new FileBackedHttpMetadataResolver(name: 'test', xmlId: 'test', metadataURL: 'http://testme', backingFile: 'metadata/testme.xml')

        def x = new OpenSamlFileBackedHTTPMetadataResolver(openSamlObjects.parserPool, null, fbhmr)
        x.refilter()

        then:
        noExceptionThrown()
    }
}
