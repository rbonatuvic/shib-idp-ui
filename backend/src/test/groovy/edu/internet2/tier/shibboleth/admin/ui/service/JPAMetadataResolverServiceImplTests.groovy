package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.PlaceholderResolverComponentsConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ClasspathMetadataResource
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataQueryProtocolScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.RegexScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.SvnMetadataResource
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.TemplateScheme
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import groovy.xml.DOMBuilder
import groovy.xml.MarkupBuilder
import net.shibboleth.ext.spring.resource.ResourceHelper
import net.shibboleth.utilities.java.support.resolver.CriteriaSet
import org.joda.time.DateTime
import org.opensaml.core.criterion.EntityIdCriterion
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.core.io.ClassPathResource
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import spock.lang.Ignore
import spock.lang.Unroll

import static edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers.generatedXmlIsTheSameAsExpectedXml

@ContextConfiguration(classes=[ JPAMRSIConfig, PlaceholderResolverComponentsConfiguration ])
class JPAMetadataResolverServiceImplTests extends AbstractBaseDataJpaTest {

    @Autowired
    EntityService entityService

    @Autowired
    MetadataResolver metadataResolver

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    MetadataResolverConverterService mdrConverterService

    @Autowired
    MetadataResolverService metadataResolverService

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    ShibUIConfiguration shibUIConfiguration

    @Autowired
    TestObjectGenerator testObjectGenerator

    DOMBuilder domBuilder = DOMBuilder.newInstance()
    StringWriter writer = new StringWriter()
    MarkupBuilder markupBuilder

    def setup() {
        markupBuilder = new MarkupBuilder(writer)
        markupBuilder.omitNullAttributes = true
        markupBuilder.omitEmptyAttributes = true
    }

    def cleanup() {
        metadataResolverRepository.deleteAll()
        writer.close()
    }

    def 'test adding a filter'() {
        given:
        def expectedXML = '''<?xml version="1.0" encoding="UTF-8"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://test.scaldingspoon.org/test1">
  <md:Extensions>
    <mdattr:EntityAttributes xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute">
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://scaldingspoon.org/realm" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>internal</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml:AttributeValue>givenName</saml:AttributeValue>
        <saml:AttributeValue>employeeNumber</saml:AttributeValue>
      </saml:Attribute>
      <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="http://shibboleth.net/ns/attributes/releaseAllValues" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:uri">
        <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:string">testme</saml2:AttributeValue>
      </saml2:Attribute>
    </mdattr:EntityAttributes>
  </md:Extensions>
  <md:SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://test.scaldingspoon.org/test1/acs" index="1"/>
  </md:SPSSODescriptor>
</md:EntityDescriptor>'''
        when:
        def mdr = new edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver().with {
            it.resourceId = "testme"
            it.name = "testme"
            it.classpathMetadataResource = new ClasspathMetadataResource().with {
                it.file = "metadata/aggregate.xml"
                it
            }
            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
                    it.setSingleValue(['http://test.scaldingspoon.org/test1'])
                    return it
                }
                it.attributes = entityService.getAttributeListFromAttributeReleaseList(['testme'])
                return it
            })
            return it
        }
        metadataResolverRepository.save(mdr)
        ((OpenSamlChainingMetadataResolver) metadataResolver).getResolvers().add(mdrConverterService.convertToOpenSamlRepresentation(mdr))
        metadataResolverService.reloadFilters("testme")

        then:
        assert metadataResolverRepository.findAll().size() > 0
        def ed = metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion('http://test.scaldingspoon.org/test1')))
        def resultString = openSamlObjects.marshalToXmlString(ed)
        println(resultString)
        def diff = DiffBuilder.compare(Input.fromString(expectedXML)).withTest(Input.fromString(resultString)).ignoreComments().ignoreWhitespace().build()
        !diff.hasDifferences()
    }

    def 'test generating EntityAttributesFilter xml snippet with condition script'() {
        given:
        def filter = testObjectGenerator.entityAttributesFilterWithConditionScript()

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it)
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/661.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating xml when filter is disabled'() {
        given:
        def filter = testObjectGenerator.entityAttributesFilterWithConditionScript()
        filter.setEnabled(Boolean.FALSE)

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it)
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/661.3.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating EntityAttributesFilter xml snippet with regex'() {
        given:
        def filter = testObjectGenerator.entityAttributesFilterWithRegex()

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it)
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/661.2.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating EntityRoleWhitelistFilter xml snippet'() {
        given:
        def filter = testObjectGenerator.entityRoleWhitelistFilter()

        when:
        genXmlSnippet(markupBuilder) { JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it) }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/533.xml', domBuilder.parseText(writer.toString()))

    }

    def 'test generating RequiredValidUntilFilter xml snippet'() {
        given:
        def filter = new RequiredValidUntilFilter().with {
            it.enabled = true
            it.maxValidityInterval = 'P14D'
            it
        }

        when:
        genXmlSnippet(markupBuilder) { JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it) }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/552.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating NameIdFormatFilter xml snippet'() {
        given:
        def filter = TestObjectGenerator.nameIdFormatFilter()

        when:
        genXmlSnippet(markupBuilder) { JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, it) }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/799.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating FileBackedHttMetadataResolver xml snippet'() {
        given:
        def resolver = testObjectGenerator.fileBackedHttpMetadataResolver()

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/532.xml', domBuilder.parseText(writer.toString()))
    }

    def 'SHIBUI-960 test generating FileBackedHttpMetadataResolver with empty EntityRoleWhitelistFilter produces no filter in the xml'() {
        given:
        def resolver = testObjectGenerator.fileBackedHttpMetadataResolver()
        def erwFilter = testObjectGenerator.entityRoleWhitelistFilter()
        erwFilter.retainedRoles.clear()
        resolver.metadataFilters.add(erwFilter)

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, markupBuilder) {
                resolver.metadataFilters.each { MetadataFilter filter ->
                    JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForFilter(filter, markupBuilder)
                }
            }
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/532.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating ResourceBackedMetadataResolver with SVN resource type xml snippet'() {
        given:
        def resolver = new edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver().with {
            it.xmlId = 'SVNResourceMetadata'
            it.svnMetadataResource = new SvnMetadataResource().with {
                it.resourceFile = 'entity.xml'
                it.repositoryURL = 'https://svn.example.org/repo/path/to.dir'
                it.workingCopyDirectory = '%{idp.home}/metadata/svn'
                it
            }
            it
        }

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/546-svn.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating ResourceBackedMetadataResolver with classpath resource type xml snippet'() {
        given:
        def resolver = new edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver().with {
            it.xmlId = 'ClasspathResourceMetadata'
            it.classpathMetadataResource = new ClasspathMetadataResource().with {
                it.file = '/path/to/a/classpath/location/metadata.xml'
                it
            }
            it
        }

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/546-classpath.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating FilesystemMetadataResolver xml snippet'() {
        given:
        def resolver = testObjectGenerator.filesystemMetadataResolver()

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/520.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating disabled MetadataResolver xml snippet'() {
        given: 'disabled metadata resolver'
        def resolver = testObjectGenerator.filesystemMetadataResolver()
        resolver.enabled = false
        metadataResolverRepository.save(resolver)

        when:
        def generatedXmlDocument = this.metadataResolverService.generateConfiguration()

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/670.xml', generatedXmlDocument)
    }

    def 'test generating DynamicHttpMetadataResolver xml snippet with MetadataQueryProtocolScheme'() {
        given:
        def resolver = new DynamicHttpMetadataResolver().with {
            it.xmlId = 'DynamicHttpMetadataResolver'
            it.metadataRequestURLConstructionScheme = new MetadataQueryProtocolScheme().with {
                it.transformRef = 'This is a transformRef'
                it.content = 'some content'
                it
            }
            it
        }

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/704.1.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating DynamicHttpMetadataResolver xml snippet with TemplateScheme'() {
        given:
        def resolver = new DynamicHttpMetadataResolver().with {
            it.xmlId = 'DynamicHttpMetadataResolver'
            it.metadataRequestURLConstructionScheme = new TemplateScheme().with {
                it.encodingStyle = TemplateScheme.EncodingStyle.FORM
                it.transformRef = 'This is a transformRef'
                it.velocityEngine = 'This is a velocityEngine'
                it.content = 'some content'
                it
            }
            it
        }

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/704.2.xml', domBuilder.parseText(writer.toString()))
    }

    def 'test generating DynamicHttpMetadataResolver xml snippet with RegexScheme'() {
        given:
        def resolver = new DynamicHttpMetadataResolver().with {
            it.xmlId = 'DynamicHttpMetadataResolver'
            it.metadataRequestURLConstructionScheme = new RegexScheme().with {
                it.match = 'This is the match field'
                it.content = 'some content'
                it
            }
            it
        }

        when:
        genXmlSnippet(markupBuilder) {
            JPAMetadataResolverServiceImpl.cast(metadataResolverService).constructXmlNodeForResolver(resolver, it) {}
        }

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/704.3.xml', domBuilder.parseText(writer.toString()))
    }

    @Unroll
    def 'test namespace protection [#namespaces]'() {
        setup:
        shibUIConfiguration.protectedAttributeNamespaces = namespaces
        def resolver = new DynamicHttpMetadataResolver().with {
            it.xmlId = 'DynamicHttpMetadataResolver'
            it.metadataRequestURLConstructionScheme = new MetadataQueryProtocolScheme().with {
                it.content = 'http://mdq-beta.incommon.org/global'
                it
            }
            it.enabled = Boolean.TRUE
            it
        }
        metadataResolverRepository.save(resolver)

        expect:
        generatedXmlIsTheSameAsExpectedXml(filename, metadataResolverService.generateConfiguration())

        where:
        namespaces | filename
        ['http://shibboleth.net/ns/profiles'] | '/conf/984.xml'
        ['http://shibboleth.net/ns/profiles', 'http://scaldingspoon.com/iam'] | '/conf/984-2.xml'
    }

    def 'test namespace protection in nonURL resolver with resolver setting enabled=true'() {
        setup:
        shibUIConfiguration.protectedAttributeNamespaces = ['http://shibboleth.net/ns/profiles']
        def resolver = new LocalDynamicMetadataResolver().with {
            it.xmlId = 'LocalDynamic'
            it.sourceDirectory = '/tmp'
            it.enabled = Boolean.TRUE
            it
        }

        when:
        metadataResolverRepository.save(resolver)

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/1059-enabled.xml', metadataResolverService.generateConfiguration())
    }
    
    def 'test namespace protection in nonURL resolver with resolver setting enabled not set'() {
        setup:
        shibUIConfiguration.protectedAttributeNamespaces = ['http://shibboleth.net/ns/profiles']
        def resolver = new LocalDynamicMetadataResolver().with {
            it.xmlId = 'LocalDynamic'
            it.sourceDirectory = '/tmp'
            it
        }

        when:
        metadataResolverRepository.save(resolver)

        then:
        generatedXmlIsTheSameAsExpectedXml('/conf/1059-disabled.xml', metadataResolverService.generateConfiguration())
    }

    @Ignore('there is a bug in org.opensaml.saml.metadata.resolver.filter.impl.EntityAttributesFilter.applyFilter')
    def 'test namespace protection internal filtering'() {
        setup:
        shibUIConfiguration.protectedAttributeNamespaces = ['http://shibboleth.net/ns/profiles']
        def resolver = new edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver().with {
            it.resourceId = 'testme984'
            it.name = 'testme984'
            it.classpathMetadataResource = new ClasspathMetadataResource('metadata/984-3.xml')
            it
        }
        def x = metadataResolverRepository.save(resolver)
        ((OpenSamlChainingMetadataResolver)metadataResolver).resolvers.add(mdrConverterService.convertToOpenSamlRepresentation(x))

        when:
        metadataResolverService.reloadFilters('testme984')
        def ed = metadataResolver.resolveSingle(new CriteriaSet(new EntityIdCriterion('http://test.scaldingspoon.org/test1')))

        then:
        !DiffBuilder.compare(Input.fromStream(this.class.getResourceAsStream('/metadata/984-3-expected.xml'))).withTest(Input.fromString(openSamlObjects.marshalToXmlString(ed))).ignoreComments().ignoreWhitespace().build().hasDifferences()
    }

    static genXmlSnippet(MarkupBuilder xml, Closure xmlNodeGenerator) {
        xml.MetadataProvider('id': 'ShibbolethMetadata',
                'xmlns': 'urn:mace:shibboleth:2.0:metadata',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:type': 'ChainingMetadataProvider',
                'xsi:schemaLocation': 'urn:mace:shibboleth:2.0:metadata http://shibboleth.net/schema/idp/shibboleth-metadata.xsd urn:mace:shibboleth:2.0:resource http://shibboleth.net/schema/idp/shibboleth-resource.xsd urn:mace:shibboleth:2.0:security http://shibboleth.net/schema/idp/shibboleth-security.xsd urn:oasis:names:tc:SAML:2.0:metadata http://docs.oasis-open.org/security/saml/v2.0/saml-schema-metadata-2.0.xsd urn:oasis:names:tc:SAML:2.0:assertion http://docs.oasis-open.org/security/saml/v2.0/saml-schema-assertion-2.0.xsd'
        ) {
            xmlNodeGenerator(delegate)
        }
    }

    @TestConfiguration
    private static class JPAMRSIConfig {
        @Bean
        MetadataResolver metadataResolver(OpenSamlObjects openSamlObjects) {
            def aggregate = new ResourceBackedMetadataResolver(ResourceHelper.of(new ClassPathResource("/metadata/aggregate.xml"))){
                @Override
                DateTime getLastRefresh() {
                    return null
                }
            }

            aggregate.with {
                it.metadataFilter = new MetadataFilterChain()
                it.id = 'testme'
                it.parserPool = openSamlObjects.parserPool
                it.initialize()
                it
            }

            return new OpenSamlChainingMetadataResolver().with {
                it.id = 'chain'
                it.initialize()
                it
            }
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