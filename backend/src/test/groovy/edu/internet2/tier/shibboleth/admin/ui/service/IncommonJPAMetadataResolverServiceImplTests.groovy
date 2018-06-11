package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import spock.lang.Specification

@SpringBootTest
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, SearchConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class IncommonJPAMetadataResolverServiceImplTests extends Specification {
    @Autowired
    MetadataResolverService metadataResolverService

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    AttributeUtility attributeUtility

    def 'simple test generation of metadata-providers.xml'() {
        when:
        def output = metadataResolverService.generateConfiguration()

        then:
        assert !DiffBuilder.compare(Input.fromStream(this.class.getResourceAsStream('/conf/278.xml'))).withTest(Input.fromDocument(output)).ignoreComments().ignoreWhitespace().build().hasDifferences()
    }

    def 'test generation of metadata-providers.xml with filters'() {
        when:
        //TODO: this might break later
        def mr = metadataResolverRepository.findAll().iterator().next()
        mr.metadataFilters.add(new EntityAttributesFilter().with {
            it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                it.value = ['https://sp1.example.org']
                it
            }
            def attribute = attributeUtility.createAttributeWithArbitraryValues('here', null, 'there')
            attribute.nameFormat = null
            attribute.namespacePrefix = 'saml'
            attribute.attributeValues.each { val ->
                val.namespacePrefix = 'saml'
            }
            it.attributes = [attribute]
            it
        })
        metadataResolverRepository.save(mr)

        def output = metadataResolverService.generateConfiguration()

        then:
        assert !DiffBuilder.compare(Input.fromStream(this.class.getResourceAsStream('/conf/278.2.xml'))).withTest(Input.fromDocument(output)).ignoreComments().ignoreWhitespace().build().hasDifferences()
    }

    //TODO: check that this configuration is sufficient
    @TestConfiguration
    static class TestConfig {
        @Autowired
        OpenSamlObjects openSamlObjects

        @Autowired
        MetadataResolverRepository metadataResolverRepository

        @Autowired
        AttributeUtility attributeUtility

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
                //Generate and test edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver. Add more as
                // we implement them
                def mr = new TestObjectGenerator(attributeUtility).fileBackedHttpMetadataResolver()
                mr.setName("HTTPMetadata")
                metadataResolverRepository.save(mr)

                // Generate and test edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver.
                metadataResolverRepository.save(new TestObjectGenerator(attributeUtility).dynamicHttpMetadataResolver())
            }

            return resolver
        }
    }
}