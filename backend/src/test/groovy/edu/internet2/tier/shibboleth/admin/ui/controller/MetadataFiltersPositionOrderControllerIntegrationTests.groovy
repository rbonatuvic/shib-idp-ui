package edu.internet2.tier.shibboleth.admin.ui.controller

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
@ActiveProfiles("no-auth")
class MetadataFiltersPositionOrderControllerIntegrationTests extends Specification {

    @Autowired
    private TestRestTemplate restTemplate

    @Autowired
    MetadataResolverRepository metadataResolverRepository

    @Autowired
    AttributeUtility attributeUtility

    TestObjectGenerator generator

    static BASE_URI = '/api/MetadataResolvers'

    static RESOURCE_URI = "$BASE_URI/%s/FiltersPositionOrder"

    def setup() {
        generator = new TestObjectGenerator(attributeUtility)
    }

    def cleanup() {
        metadataResolverRepository.deleteAll()
    }

    def "GET Filter Position Order for non-existent resolver"() {
        when: 'GET request is made with resolver resource id NOT matching any existing filter'
        def result = getFiltersPositionOrderFor('non-existent-resolver-id', String)

        then: "Request completed successfully"
        result.statusCodeValue == 404
    }

    def "GET Default Filter Position Order for filters originally attached to a resolver"() {
        given: 'MetadataResolver with 2 filters in data store'
        def resolver = createResolverWithTwoFilters()

        when: 'GET request is made to retrieve position order of filters'
        def result = getFiltersPositionOrderFor(resolver.resourceId, List)

        then: 'Original filters order is preserved'
        result.statusCodeValue == 200
        result.body == [resolver.firstFilterResourceId, resolver.secondFilterResourceId]
    }

    def "Reorder filters and verify the position within resolver persisted accordingly"() {
        given: 'MetadataResolver with 2 filters in data store'
        def resolver = createResolverWithTwoFilters()
        def reOrderedFiltersPosition = [resolver.secondFilterResourceId, resolver.firstFilterResourceId]

        when: 'POST is made to re-order filters position'
        def reorderPOSTResult = reorderFilters(resolver.resourceId, reOrderedFiltersPosition)

        then: 'Request completed successfully'
        reorderPOSTResult.statusCodeValue == 204

        and: 'GET request is made to retrieve position order of filters'
        def positionOrderResult = getFiltersPositionOrderFor(resolver.resourceId, List)

        then:
        positionOrderResult.body == reOrderedFiltersPosition

        and: "Request is made to retrieve the resolver with affected filters"
        def resolverResult = getResolver(resolver.resourceId)

        then:
        resolverResult.statusCodeValue == 200
        resolverResult.body.metadataFilters.collect {it.resourceId} == reOrderedFiltersPosition
    }

    def "Reorder filters with bad data"() {
        given: 'MetadataResolver with 2 filters in data store'
        def resolver = createResolverWithTwoFilters()
        def originalFiltersPosition = [resolver.firstFilterResourceId, resolver.secondFilterResourceId]
        //Only one filter in order position data, while there are two filters
        def reOrderedFiltersPosition = [resolver.secondFilterResourceId]

        when: 'POST is made to re-order filters position with invalid number of filters to re-order'
        def reorderPOSTResult = reorderFilters(resolver.resourceId, reOrderedFiltersPosition)

        then: 'Request completed successfully with 400'
        reorderPOSTResult.statusCodeValue == 400

        and: 'GET request is made to retrieve position order of filters'
        def positionOrderResult = getFiltersPositionOrderFor(resolver.resourceId, List)

        then: 'Original filters position order is retrieved'
        positionOrderResult.body == originalFiltersPosition

        and: "Request is made to retrieve the resolver with original filters"
        def resolverResult = getResolver(resolver.resourceId)

        then:
        resolverResult.statusCodeValue == 200
        resolverResult.body.metadataFilters.collect {it.resourceId} == originalFiltersPosition

        and: 'POST is made to re-order filters position with invalid resource ids'
        def reorderPOSTResult_2 = reorderFilters(resolver.resourceId, ['invalid', 'resource ids'])

        then: 'Request completed successfully with 400'
        reorderPOSTResult_2.statusCodeValue == 400
    }

    private createResolverWithTwoFilters() {
        def resolver = generator.buildRandomMetadataResolverOfType('FileBacked')
        resolver.metadataFilters = [generator.signatureValidationFilter(), generator.entityRoleWhitelistFilter()]
        def resolverResourceId = resolver.resourceId
        def firstFilterResourceId = resolver.metadataFilters[0].resourceId
        def secondFilterResourceId = resolver.metadataFilters[1].resourceId
        metadataResolverRepository.save(resolver)

        [resourceId            : resolverResourceId,
         firstFilterResourceId : firstFilterResourceId,
         secondFilterResourceId: secondFilterResourceId]
    }

    private getFiltersPositionOrderFor(String resourceId, responseType) {
        this.restTemplate.getForEntity(resourceUriFor(resourceId), responseType)
    }

    private reorderFilters(String resourceId, List filterIdsPositionOrderList) {
        this.restTemplate.postForEntity(resourceUriFor(resourceId), filterIdsPositionOrderList, null)
    }

    private getResolver(String resolverResourceId) {
        this.restTemplate.getForEntity("$BASE_URI/$resolverResourceId", Object)
    }

    private static resourceUriFor(String resolverResourceId) {
        String.format(RESOURCE_URI, resolverResourceId)
    }
}