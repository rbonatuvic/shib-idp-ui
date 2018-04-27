package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import org.apache.http.impl.client.HttpClients
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import spock.lang.Specification

@SpringBootTest
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class IncommonJPAMetadataResolverServiceImplTests extends Specification {
    @Autowired
    MetadataResolverService metadataResolverService

    def 'test generation of metadata-providers.xml'() {
        when:
        def output = metadataResolverService.generateConfiguration()

        then:
        assert !DiffBuilder.compare(Input.fromStream(this.class.getResourceAsStream('/conf/278.xml'))).withTest(Input.fromDocument(output)).ignoreComments().ignoreWhitespace().build().hasDifferences()
    }

    //TODO: check that this configuration is sufficient
    @TestConfiguration
    static class Config {
        @Autowired
        OpenSamlObjects openSamlObjects

        @Autowired
        MetadataResolverRepository metadataResolverRepository

        @Bean
        MetadataResolver metadataResolver() {
            def resolver = new ChainingMetadataResolver().with {
                it.id = 'chain'

                resolvers = [
                        [
                                'id': { 'incommonmd' }
                        ] as MetadataResolver
                ]
                it.initialize()
                it
            }

            if (!metadataResolverRepository.findAll().iterator().hasNext()) {
                edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver mr = new edu.internet2.tier.shibboleth.admin.ui.domain.MetadataResolver()
                mr.setName("incommonmd")
                metadataResolverRepository.save(mr)
            }

            return resolver
        }
    }
}