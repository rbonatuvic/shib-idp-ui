package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import spock.lang.Specification

class OpenSamlFilesystemMetadataResolverTests extends Specification {
    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

    def "test refresh"() {
        when:
        def fsmr = new FilesystemMetadataResolver(name: 'test', xmlId: 'test', metadataFile: 'metadata/metadata.xml')
        def x = new OpenSamlFilesystemMetadataResolver(openSamlObjects.parserPool, null, fsmr, new File(fsmr.metadataFile))
        x.refilter()

        then:
        noExceptionThrown()
    }
}
