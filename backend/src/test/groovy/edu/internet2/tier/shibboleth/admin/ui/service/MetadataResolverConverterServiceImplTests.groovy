package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.BaseDataJpaTestSetup
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration

@ContextConfiguration(classes=[MRCSILocalConfig, PlaceholderResolverComponentsConfiguration])
class MetadataResolverConverterServiceImplTests extends BaseDataJpaTestSetup {
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

    @TestConfiguration
    private static class MRCSILocalConfig {
        @Bean
        DirectoryService directoryService() {
            return new DirectoryServiceImpl()
        }

        @Bean
        MetadataResolverConverterServiceImpl metadataResolverConverterServiceImpl(IndexWriterService indexWriterService, OpenSamlObjects openSamlObjects) {
            return new MetadataResolverConverterServiceImpl().with {
                it.indexWriterService = indexWriterService
                it.openSamlObjects = openSamlObjects
                it
            }
        }
    }
}