package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter
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
import org.springframework.test.context.ContextConfiguration

import spock.lang.Specification

import static edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers.*

@SpringBootTest
@DataJpaTest
@ContextConfiguration(classes = [CoreShibUiConfiguration, SearchConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class IncommonJPAMetadataResolverServiceImplTests extends Specification {
    @Autowired
    MetadataResolverService metadataResolverService

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    AttributeUtility attributeUtility

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    def 'simple test generation of metadata-providers.xml'() {
        when:
        def mr = metadataResolverRepository.findAll().iterator().next()
        mr.metadataFilters << requiredValidUntilFilterForXmlGenerationTests()
        mr.metadataFilters << entityRoleWhiteListFilterForXmlGenerationTests()
        metadataResolverRepository.save(mr)
        def output = metadataResolverService.generateConfiguration()

        println(output.documentElement)

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/278.xml', output)
    }

    def 'test generation of metadata-providers.xml with filters'() {
        when:
        //TODO: this might break later
        def mr = metadataResolverRepository.findAll().iterator().next()
        mr.metadataFilters << requiredValidUntilFilterForXmlGenerationTests()
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
        mr.metadataFilters << entityRoleWhiteListFilterForXmlGenerationTests()
        metadataResolverRepository.save(mr)

        def output = metadataResolverService.generateConfiguration()

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/278.2.xml', output)
    }

    EntityRoleWhiteListFilter entityRoleWhiteListFilterForXmlGenerationTests() {
        new EntityRoleWhiteListFilter().with {
            it.retainedRoles = ['md:SPSSODescriptor']
            it
        }
    }

    RequiredValidUntilFilter requiredValidUntilFilterForXmlGenerationTests() {
        new RequiredValidUntilFilter().with {
            it.maxValidityInterval = 'P14D'
            it
        }
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
                metadataResolverRepository.save(new TestObjectGenerator(attributeUtility).fileBackedHttpMetadataResolver())

                // Generate and test edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver.
                metadataResolverRepository.save(new TestObjectGenerator(attributeUtility).dynamicHttpMetadataResolver())

                // Generate and test edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver.
                metadataResolverRepository.save(new TestObjectGenerator(attributeUtility).localDynamicMetadataResolver())

                // Generate and test edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
                metadataResolverRepository.save(new TestObjectGenerator(attributeUtility).resourceBackedMetadataResolverForClasspath())
            }

            return resolver
        }
    }
}