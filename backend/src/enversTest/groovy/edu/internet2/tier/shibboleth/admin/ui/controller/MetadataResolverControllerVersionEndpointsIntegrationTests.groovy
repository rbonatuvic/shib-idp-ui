package edu.internet2.tier.shibboleth.admin.ui.controller

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
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
class MetadataResolverControllerVersionEndpointsIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository repository

    static BASE_URI = '/api/MetadataResolvers'

    static ALL_VERSIONS_URI = "$BASE_URI/%s/Versions"

    static SPECIFIC_VERSION_URI = "$BASE_URI/%s/Versions/%s"

    def "GET /api/MetadataResolvers/{resourceId}/Versions with non-existent resolver"() {
        when:
        def result = getAllMetadataResolverVersions('non-existent-resolver-id', String)

        then:
        result.statusCodeValue == 404
    }

    def "GET /api/MetadataResolvers/{resourceId}/Versions with 1 resolver version"() {
        given:
        MetadataResolver mr = new LocalDynamicMetadataResolver(name: 'resolver')
        repository.save(mr)

        when:
        def result = getAllMetadataResolverVersions(mr.resourceId, List)

        then:
        result.statusCodeValue == 200
        result.body.size == 1
        result.body[0].id && result.body[0].creator && result.body[0].date
    }

    def "GET /api/MetadataResolvers/{resourceId}/Versions with 2 resolver versions"() {
        given:
        MetadataResolver mr = new FileBackedHttpMetadataResolver(name: 'resolver')
        mr = repository.save(mr)
        //Will create a second version for UPDATE revision
        mr.name = 'resolverUPDATED'
        repository.save(mr)

        when:
        def result = getAllMetadataResolverVersions(mr.resourceId, List)

        then:
        result.statusCodeValue == 200
        result.body.size == 2
        result.body[0].id < result.body[1].id
        result.body[0].date < result.body[1].date
    }

    def "GET /api/MetadataResolvers/{resourceId}/Versions/{version} for non existent version"() {
        given:
        MetadataResolver mr = new DynamicHttpMetadataResolver(name: 'resolver')
        mr = repository.save(mr)

        when:
        def result = getMetadataResolverForVersion(mr.resourceId, '1000', MetadataResolver)

        then:
        result.statusCodeValue == 404
    }

    def "GET /api/MetadataResolvers/{resourceId}/Versions/{version} with 2 resolver versions returns correct resolver for specific version"() {
        given:
        MetadataResolver mr = new FilesystemMetadataResolver(name: 'resolver')
        mr = repository.save(mr)
        //Will create a second version for UPDATE revision
        mr.name = 'resolverUPDATED'
        repository.save(mr)

        when:
        def allVersions = getAllMetadataResolverVersions(mr.resourceId, List)
        def mrv1 = getMetadataResolverForVersion(mr.resourceId, allVersions.body[0].id, MetadataResolver)
        def mrv2 = getMetadataResolverForVersion(mr.resourceId, allVersions.body[1].id, MetadataResolver)

        then:
        mrv1.statusCodeValue == 200
        mrv1.body.name == 'resolver'
        mrv2.statusCodeValue == 200
        mrv2.body.name == 'resolverUPDATED'
    }

    private getAllMetadataResolverVersions(String resourceId, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(ALL_VERSIONS_URI, resourceId), responseType)
    }

    private getMetadataResolverForVersion(String resourceId, String version, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(SPECIFIC_VERSION_URI, resourceId, version), responseType)
    }

    private static resourceUriFor(String uriTemplate, String resourceId, String version) {
        String.format(uriTemplate, resourceId, version)
    }

    private static resourceUriFor(String uriTemplate, String resourceId) {
        String.format(uriTemplate, resourceId)
    }
}
