package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFileBackedHTTPMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.security.repository.GroupsRepository
import edu.internet2.tier.shibboleth.admin.ui.security.service.GroupServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.RefreshableMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import java.nio.file.Files

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, InternationalizationConfiguration, MyConfig, PlaceholderResolverComponentsConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class EntityDescriptorTest extends Specification {

    RandomGenerator randomGenerator
    TestObjectGenerator generator

    @Autowired
    MetadataResolver metadataResolver

    @Autowired
    IndexWriterService indexWriterService

    def openSamlObjects = new OpenSamlObjects().with {
        init()
        it
    }

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
                                httpMetadataResolverAttributes: new HttpMetadataResolverAttributes()
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
    static class MyConfig {
        @Bean
        MetadataResolver metadataResolver() {
            ChainingMetadataResolver metadataResolver = new OpenSamlChainingMetadataResolver()
            metadataResolver.setId("chain")
            metadataResolver.resolvers = new ArrayList<>()
            metadataResolver.initialize()
            return metadataResolver
        }
        
        @Bean
        GroupServiceImpl groupService(GroupsRepository repo) {
            new GroupServiceImpl().with {
                it.repo = repo
                return it
            }
        }
    }
}
