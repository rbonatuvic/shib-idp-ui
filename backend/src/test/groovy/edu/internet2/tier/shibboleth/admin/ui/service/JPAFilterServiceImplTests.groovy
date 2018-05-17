package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class JPAFilterServiceImplTests extends Specification {

    RandomGenerator randomGenerator
    TestObjectGenerator testObjectGenerator

    @Autowired
    JPAFilterServiceImpl service

    @Autowired
    AttributeUtility attributeUtility

    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility)
    }

    def "createFilterFromRepresentation properly creates a filter from a representation"() {
        given:
        def representation = testObjectGenerator.buildFilterRepresentation()

        when:
        def result = service.createFilterFromRepresentation(representation)

        then:
        result.name == representation.filterName
        // Note: We don't test result.resourceId == representation.id because representations only have ids when built from filters.
        result.filterEnabled == representation.filterEnabled

        //TODO? Should we test that the actual attributes are what we expect them to be? Would make for a much more
        //complicated test. Testing size is fairly useful, but it forces us to assume that the attributes are what they
        //should be. Maybe testing that the attributes are what they should be should be done in a unit test for the
        //actual method that builds the attributes list?
        result.getAttributes().size() ==
                representation.getAttributeRelease().size() +
                TestHelpers.determineCountOfAttributesFromRelyingPartyOverrides(representation.getRelyingPartyOverrides())

        result.entityAttributesFilterTarget.value == representation.filterTarget.value
        result.entityAttributesFilterTarget.entityAttributesFilterTargetType.toString() == representation.filterTarget.type
    }

    def "createRepresentationFromFilter properly creates a representation from a filter"() {
        given:
        def filter = testObjectGenerator.buildEntityAttributesFilter()

        when:
        def result = service.createRepresentationFromFilter(filter)

        then:
        result.id == filter.resourceId
        result.filterName == filter.name
        result.filterEnabled == filter.filterEnabled
        result.version == filter.hashCode()

        //TODO? See note above, same question.
        result.getAttributeRelease().size() +
                TestHelpers.determineCountOfAttributesFromRelyingPartyOverrides(result.getRelyingPartyOverrides()) ==
                filter.getAttributes().size()

        result.filterTarget.type == filter.entityAttributesFilterTarget.entityAttributesFilterTargetType.toString()
        result.filterTarget.value == filter.entityAttributesFilterTarget.value
    }
}
