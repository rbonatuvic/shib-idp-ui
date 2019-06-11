package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
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

    def "GET /api/EntityDescriptor/{resourceId}/Versions with non-existent entity descriptor"() {
        when:
        def result = getAllEntityDescriptorVersions('non-existent-ed-id', String)

        then:
        result.statusCodeValue == 404
    }

    def "GET /api/EntityDescriptor{resourceId}/Versions with 1 entity descriptor version"() {
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

    def "GET /api/EntityDescriptor{resourceId}/Versions with 2 entity descriptor versions"() {
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



    private getAllEntityDescriptorVersions(String resourceId, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(ALL_VERSIONS_URI, resourceId), responseType)
    }


    private static resourceUriFor(String uriTemplate, String resourceId) {
        String.format(uriTemplate, resourceId)
    }
}
