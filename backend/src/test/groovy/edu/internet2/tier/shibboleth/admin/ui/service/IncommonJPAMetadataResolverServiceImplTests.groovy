package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.XSString
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration

import static edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers.generatedXmlIsTheSameAsExpectedXml

@ContextConfiguration(classes = [IJPAMRSILocalConfig])
class IncommonJPAMetadataResolverServiceImplTests extends AbstractBaseDataJpaTest {
    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    MetadataResolverService metadataResolverService

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    def 'simple test generation of metadata-providers.xml'() {
        when:
        def mr = metadataResolverRepository.findAll().iterator().next()
        mr.metadataFilters << new SignatureValidationFilter(requireSignedRoot: true, certificateFile: '%{idp.home}/credentials/inc-md-cert.pem')
        mr.metadataFilters << requiredValidUntilFilterForXmlGenerationTests()
        mr.metadataFilters << entityRoleWhiteListFilterForXmlGenerationTests()
        metadataResolverRepository.save(mr)
        def output = metadataResolverService.generateConfiguration()

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/278.xml', output)
    }

    def 'test generation of metadata-providers.xml with filters'() {
        when:
        //TODO: this might break later
        def mr = metadataResolverRepository.findAll().iterator().next()
        mr.metadataFilters << new SignatureValidationFilter(requireSignedRoot: true, certificateFile: '%{idp.home}/credentials/inc-md-cert.pem')
        mr.metadataFilters << requiredValidUntilFilterForXmlGenerationTests()
        mr.metadataFilters.add(new EntityAttributesFilter().with {
            it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                it.value = ['https://sp1.example.org']
                it
            }
            def attribute = attributeUtility.createAttributeWithStringValues('here', null, 'there')
            attribute.nameFormat = 'urn:oasis:names:tc:SAML:2.0:attrname-format:uri'
            attribute.namespacePrefix = 'saml'
            attribute.attributeValues.each { val ->
                ((XSString)val).namespacePrefix = 'saml'
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

    @TestConfiguration
    private static class IJPAMRSILocalConfig {
        @Bean
        MetadataResolver metadataResolver(AttributeUtility attributeUtility, MetadataResolverRepository metadataResolverRepository) {
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

        @Bean
        MetadataResolversPositionOrderContainerService metadataResolversPositionOrderContainerService(MetadataResolversPositionOrderContainerRepository positionOrderContainerRepository,
                                                                                                      MetadataResolverRepository resolverRepository) {
            return new DefaultMetadataResolversPositionOrderContainerService(positionOrderContainerRepository, resolverRepository)
        }
    }
}