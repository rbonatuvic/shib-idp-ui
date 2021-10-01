package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFileBackedHTTPMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.RefreshableMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@ContextConfiguration(classes = [ EDLocalConfig, PlaceholderResolverComponentsConfiguration ])
class EntityDescriptorTest extends AbstractBaseDataJpaTest {
    @Autowired
    IndexWriterService indexWriterService

    @Autowired
    MetadataResolver metadataResolver

    @Autowired
    OpenSamlObjects openSamlObjects

    RandomGenerator randomGenerator
    TestObjectGenerator generator

    def setup() {
        generator = new TestObjectGenerator()
        randomGenerator = new RandomGenerator()
    }

    def "entity descriptors properly marshall to xml"() {
        given:
        ((OpenSamlChainingMetadataResolver)metadataResolver).resolvers = [
                new OpenSamlFileBackedHTTPMetadataResolver(
                        openSamlObjects.parserPool,
                        indexWriterService.getIndexWriter('testme'),
                        new FileBackedHttpMetadataResolver(
                                metadataURL: 'https://idp.unicon.net/idp/shibboleth',
                                backingFile: "%{idp.home}/metadata/test.xml",
                                reloadableMetadataResolverAttributes: new ReloadableMetadataResolverAttributes(),
                                httpMetadataResolverAttributes: new HttpMetadataResolverAttributes(),
                                initializeFromBackupFile: Boolean.TRUE
                        )
                ).with {
                    it.initialize()
                    it
                }]

        when:
        ((RefreshableMetadataResolver)metadataResolver).refresh()

        then: 'no exceptions should be thrown'
        noExceptionThrown()
    }

    @TestConfiguration
    private static class EDLocalConfig {
        @Bean
        MetadataResolver metadataResolver() {
            ChainingMetadataResolver metadataResolver = new OpenSamlChainingMetadataResolver()
            metadataResolver.setId("chain")
            metadataResolver.resolvers = new ArrayList<>()
            metadataResolver.initialize()
            return metadataResolver
        }
    }
}