package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.domain.Organization
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationDisplayName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationName
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationURL
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import groovy.json.JsonOutput
import groovy.json.JsonSlurper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles
import spock.lang.Specification

/**
 * @author Dmitriy Kopylenko
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles(['no-auth', 'dev'])
class EntityDescriptorControllerVersionEndpointsIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    EntityDescriptorRepository entityDescriptorRepository

    static BASE_URI = '/api/EntityDescriptor'

    static ALL_VERSIONS_URI = "$BASE_URI/%s/Versions"

    static SPECIFIC_VERSION_URI = "$BASE_URI/%s/Versions/%s"

    def "GET /api/EntityDescriptor/{resourceId}/Versions with non-existent entity descriptor"() {
        when:
        def result = getAllEntityDescriptorVersions('non-existent-ed-id', String)

        then:
        result.statusCodeValue == 404
    }

    def "GET /api/EntityDescriptor/{resourceId}/Versions with 1 entity descriptor version"() {
        given:
        EntityDescriptor ed = new EntityDescriptor(entityID: 'http://test/controller', createdBy: 'anonymousUser')
        entityDescriptorRepository.save(ed)

        when:
        def result = getAllEntityDescriptorVersions(ed.resourceId, List)

        then:
        result.statusCodeValue == 200
        result.body.size == 1
        result.body[0].id && result.body[0].creator && result.body[0].date
    }

    def "GET /api/EntityDescriptor/{resourceId}/Versions with 2 entity descriptor versions"() {
        given:
        EntityDescriptor ed = new EntityDescriptor(entityID: 'http://test/controller', createdBy: 'anonymousUser')
        ed = entityDescriptorRepository.save(ed)
        //Will created a second version for UPDATE revision
        ed.serviceEnabled = true
        entityDescriptorRepository.save(ed)

        when:
        def result = getAllEntityDescriptorVersions(ed.resourceId, List)

        then:
        result.statusCodeValue == 200
        result.body.size == 2
        result.body[0].id < result.body[1].id
        result.body[0].date < result.body[1].date
    }

    def "GET /api/EntityDescriptor/{resourceId}/Versions/{version} for non existent version"() {
        given:
        EntityDescriptor ed = new EntityDescriptor(entityID: 'http://test/controller', createdBy: 'anonymousUser')
        ed = entityDescriptorRepository.save(ed)

        when:
        def result = getEntityDescriptorForVersion(ed.resourceId, '1000', EntityDescriptorRepresentation)

        then:
        result.statusCodeValue == 404
    }

    def "GET /api/EntityDescriptor{resourceId}/Versions/{version} with 2 entity descriptor versions returns correct ED for specific versions"() {
        given:
        EntityDescriptor ed = new EntityDescriptor(entityID: 'http://test/controller', createdBy: 'anonymousUser', serviceProviderName: 'SP1')
        ed = entityDescriptorRepository.save(ed)
        //Will created a second version for UPDATE revision
        ed.serviceProviderName = 'SP2'
        entityDescriptorRepository.save(ed)

        when:
        def allVersions = getAllEntityDescriptorVersions(ed.resourceId, List)
        def edv1 = getEntityDescriptorForVersion(ed.resourceId, allVersions.body[0].id, EntityDescriptorRepresentation)
        def edv2 = getEntityDescriptorForVersion(ed.resourceId, allVersions.body[1].id, EntityDescriptorRepresentation)

        then:
        edv1.statusCodeValue == 200
        edv1.body.serviceProviderName == 'SP1'
        edv2.statusCodeValue == 200
        edv2.body.serviceProviderName == 'SP2'
    }

    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    def 'SHIBUI-1414'() {
        given:
        def ed = new EntityDescriptor(entityID: 'testme', serviceProviderName: 'testme').with {
            entityDescriptorRepository.save(it)
        }.with {
            it.setOrganization(new Organization().with {
                it.organizationNames = [new OrganizationName(value: 'testme', XMLLang: 'en')]
                it.organizationDisplayNames = [new OrganizationDisplayName(value: 'testme', XMLLang: 'en')]
                it.organizationURLs = [new OrganizationURL(value: 'http://testme.org', XMLLang: 'en')]
                it
            })
            entityDescriptorRepository.save(it)
        }
        when:
        def headers = new HttpHeaders().with {
            it.set(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            it
        }

        def allVersions = getAllEntityDescriptorVersions(ed.resourceId, List)
        String edv1 = getEntityDescriptorForVersion(ed.resourceId, allVersions.body[0].id, String).body
        def tedv2 = getEntityDescriptorForVersion(ed.resourceId, allVersions.body[1].id, EntityDescriptorRepresentation).body

        def aedv1 = new JsonSlurper().parseText(edv1).with {
            it.put('version', tedv2.version)
            it
        }.with {
            JsonOutput.toJson(it)
        }

        def request = new HttpEntity(aedv1, headers)
        def response = this.restTemplate.exchange("/api/EntityDescriptor/${ed.resourceId}", HttpMethod.PUT, request, String)

        then:
        response.statusCodeValue != 400
        noExceptionThrown()
    }

    private getAllEntityDescriptorVersions(String resourceId, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(ALL_VERSIONS_URI, resourceId), responseType)
    }

    private getEntityDescriptorForVersion(String resourceId, String version, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(SPECIFIC_VERSION_URI, resourceId, version), responseType)
    }

    private static resourceUriFor(String uriTemplate, String resourceId, String version) {
        String.format(uriTemplate, resourceId, version)
    }

    private static resourceUriFor(String uriTemplate, String resourceId) {
        String.format(uriTemplate, resourceId)
    }
}