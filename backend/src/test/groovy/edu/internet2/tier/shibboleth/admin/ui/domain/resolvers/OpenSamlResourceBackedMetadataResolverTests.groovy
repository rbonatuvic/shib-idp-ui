package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import net.shibboleth.ext.spring.resource.ResourceHelper
import org.springframework.core.io.ClassPathResource
import spock.lang.Specification

class OpenSamlResourceBackedMetadataResolverTests extends Specification {
    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def 'test refresh'() {
        when:
        def rbmr = new ResourceBackedMetadataResolver(name: 'test', xmlId: 'test', classpathMetadataResource: new ClasspathMetadataResource('metadata/metadata.xml'))
        def x = new OpenSamlResourceBackedMetadataResolver(openSamlObjects.parserPool, null, rbmr, ResourceHelper.of(new ClassPathResource(rbmr.classpathMetadataResource.file)))
        x.refilter()

        then:
        noExceptionThrown()
    }
}
