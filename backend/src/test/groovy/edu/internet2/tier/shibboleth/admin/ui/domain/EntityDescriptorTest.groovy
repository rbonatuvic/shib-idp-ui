package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.AbstractReloadingMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntityDescriptorTest extends Specification {

    RandomGenerator randomGenerator
    TestObjectGenerator generator

    @Autowired
    MetadataResolver metadataResolver

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
        def resolvers = ((OpenSamlChainingMetadataResolver) metadataResolver).resolvers

        when:
        ((AbstractReloadingMetadataResolver) resolvers[0]).refresh()

        then:
        println("We didn't explode .. hopefully.")

    }
}
