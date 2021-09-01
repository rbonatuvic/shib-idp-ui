package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration

import spock.lang.Specification

@SpringBootTest
class MetadataResolverConverterServiceImplTests extends Specification {

    @Autowired
    MetadataResolverConverterService mrConverterServiceUnderTest

    def "conversion to OpenSamlLocalDynamicMetadataResolver with source directory name matching existing file (non-directory) succeeds"() {
        given:
        LocalDynamicMetadataResolver mr = new LocalDynamicMetadataResolver().with {
            it.name = 'SHIBUI-1639'
            it.sourceDirectory = File.createTempFile('foo', null).absolutePath
            it.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes()
            it
        }
        when:
        mrConverterServiceUnderTest.convertToOpenSamlRepresentation(mr)

        then:
        noExceptionThrown()
    }
}
