package edu.internet2.tier.shibboleth.admin.ui.scheduled

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import org.xmlunit.builder.DiffBuilder
import org.xmlunit.builder.Input
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class EntityDescriptorFilesScheduledTasksTests extends Specification {

    def tempPath = "/tmp/shibui"

    def directory

    @Autowired
    OpenSamlObjects openSamlObjects

    def entityDescriptorRepository = Mock(EntityDescriptorRepository)

    def entityDescriptorFilesScheduledTasks

    def service

    def randomGenerator

    def setup() {
        randomGenerator = new RandomGenerator()
        tempPath = tempPath + randomGenerator.randomRangeInt(10000, 20000)
        service = new JPAEntityDescriptorServiceImpl(openSamlObjects, new JPAEntityServiceImpl(openSamlObjects))
        entityDescriptorFilesScheduledTasks = new EntityDescriptorFilesScheduledTasks(tempPath, entityDescriptorRepository, openSamlObjects)
        directory = new File(tempPath)
        directory.mkdir()
    }

    def "generateEntityDescriptorFiles properly generates a file from an Entity Descriptor"() {
        given:
        def expectedXml = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1-FAILED1">
  <md:Organization>
    <md:OrganizationName xml:lang="en">name</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">display name</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">http://test.example.org</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>
                     '''

        def entityDescriptor = service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.organization = new OrganizationRepresentation().with {
                it.name = 'name'
                it.displayName = 'display name'
                it.url = 'http://test.example.org'
                it
            }
            it
        })
        1 * entityDescriptorRepository.findAllByServiceEnabled(true) >> [entityDescriptor].stream()

        when:
        if (directory.exists()) {
            entityDescriptorFilesScheduledTasks.generateEntityDescriptorFiles()
        } else {
            throw new RuntimeException("temp directory does not exist!")
        }

        then:
        def files = new File(tempPath).listFiles({d, f -> f ==~ /.*.xml/ } as FilenameFilter)
        files.size() == 1
        def result = files[0].text
        def diff = DiffBuilder.compare(Input.fromString(expectedXml)).withTest(Input.fromString(result)).ignoreComments().ignoreWhitespace().build()
        !diff.hasDifferences()
    }

    def "removeDanglingEntityDescriptorFiles properly deletes files"() {
        given:
        def expectedXml = '''
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata"
                     xmlns:mdattr="urn:oasis:names:tc:SAML:metadata:attribute"
                     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                     xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                     xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                     entityID="http://test.example.org/test1">
  <md:Organization>
    <md:OrganizationName xml:lang="en">name</md:OrganizationName>
    <md:OrganizationDisplayName xml:lang="en">display name</md:OrganizationDisplayName>
    <md:OrganizationURL xml:lang="en">http://test.example.org</md:OrganizationURL>
  </md:Organization>
</md:EntityDescriptor>
                     '''

        def entityDescriptor = service.createDescriptorFromRepresentation(new EntityDescriptorRepresentation().with {
            it.entityId = 'http://test.example.org/test1'
            it.organization = new OrganizationRepresentation().with {
                it.name = 'name'
                it.displayName = 'display name'
                it.url = 'http://test.example.org'
                it
            }
            it
        })

        def file = new File(directory, randomGenerator.randomId() + ".xml")
        file.text = "Delete me!"

        1 * entityDescriptorRepository.findAllByServiceEnabled(true) >> [entityDescriptor].stream()

        when:
        entityDescriptorFilesScheduledTasks.removeDanglingEntityDescriptorFiles()

        then:
        def files = new File(tempPath, file)
        files.size() == 0
    }

    def cleanup() {
        directory.deleteDir()
    }
}