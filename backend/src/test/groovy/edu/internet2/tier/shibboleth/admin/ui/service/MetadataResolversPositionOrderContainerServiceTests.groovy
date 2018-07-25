package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolversPositionOrderContainerRepository
import spock.lang.Specification
import spock.lang.Subject

/**
 * @author Dmitriy Kopylenko
 */
class MetadataResolversPositionOrderContainerServiceTests extends Specification {

    def "no order container has been provided and saved, so using unordered persisted resolvers"() {
        given:
        def resolverRepo = Mock(MetadataResolverRepository)
        resolverRepo.findAll() >> [new MetadataResolver(resourceId: 'second'), new MetadataResolver(resourceId: 'first')]
        def positionOrderRepo = Mock(MetadataResolversPositionOrderContainerRepository)
        positionOrderRepo.findAll() >> []
        @Subject
        def positionContainerSvc = new DefaultMetadataResolversPositionOrderContainerService(positionOrderRepo, resolverRepo)

        when:
        def unorderedResolvers = positionContainerSvc.getAllMetadataResolversInDefinedOrderOrUnordered()

        then:
        unorderedResolvers[0].resourceId == 'second'
        unorderedResolvers[1].resourceId == 'first'

    }

    def "an order container has been provided and saved, so using resolvers with order defined in that position order container"() {
        given:
        def resolverRepo = Mock(MetadataResolverRepository)
        resolverRepo.findAll() >> [new MetadataResolver(resourceId: 'second'), new MetadataResolver(resourceId: 'first')]
        resolverRepo.findByResourceId('first') >> new MetadataResolver(resourceId: 'first')
        resolverRepo.findByResourceId('second') >> new MetadataResolver(resourceId: 'second')
        def positionOrderRepo = Mock(MetadataResolversPositionOrderContainerRepository)
        positionOrderRepo.findAll() >> [new MetadataResolversPositionOrderContainer(resourceIds: ['first', 'second'])]
        positionOrderRepo.findAll() >> []
        @Subject
        def positionContainerSvc = new DefaultMetadataResolversPositionOrderContainerService(positionOrderRepo, resolverRepo)

        when:
        def orderedResolvers = positionContainerSvc.getAllMetadataResolversInDefinedOrderOrUnordered()

        then:
        orderedResolvers[0].resourceId == 'first'
        orderedResolvers[1].resourceId == 'second'

    }
}
