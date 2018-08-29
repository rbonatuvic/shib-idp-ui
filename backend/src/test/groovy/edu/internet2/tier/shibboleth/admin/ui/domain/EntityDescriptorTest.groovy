package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFileBackedHTTPMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.apache.http.impl.client.HttpClients
import org.apache.lucene.index.IndexWriter
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.RefreshableMetadataResolver
import org.opensaml.saml.metadata.resolver.impl.AbstractReloadingMetadataResolver
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
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
        ((OpenSamlChainingMetadataResolver)metadataResolver).resolvers.add(
                new OpenSamlFileBackedHTTPMetadataResolver(
                        openSamlObjects.parserPool,
                        indexWriterService.getIndexWriter('testme'),
                        new FileBackedHttpMetadataResolver(
                                metadataURL: 'https://idp.unicon.net/idp/shibboleth',
                                backingFile: '/x.xml',
                                reloadableMetadataResolverAttributes: new ReloadableMetadataResolverAttributes(),
                                httpMetadataResolverAttributes: new HttpMetadataResolverAttributes()
                        )
                )
        )

        when:
        ((RefreshableMetadataResolver)metadataResolver).refresh()

        then:
        println("We didn't explode .. hopefully.")

    }
}
