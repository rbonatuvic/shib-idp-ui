package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.configuration.CustomPropertiesConfiguration
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestHelpers
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.util.AttributeUtility
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.ContextConfiguration

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@ContextConfiguration(classes = [ JPAFSIConfig ])
class JPAFilterServiceImplTests extends AbstractBaseDataJpaTest {

    @Autowired
    AttributeUtility attributeUtility

    @Autowired
    CustomPropertiesConfiguration customPropertiesConfiguration

    @Autowired
    JPAFilterServiceImpl filterService

    RandomGenerator randomGenerator
    TestObjectGenerator testObjectGenerator

    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator(attributeUtility, customPropertiesConfiguration)
    }

    def "createFilterFromRepresentation properly creates a filter from a representation"() {
        given:
        def representation = testObjectGenerator.buildFilterRepresentation()

        when:
        def result = filterService.createFilterFromRepresentation(representation)

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
        def filter = testObjectGenerator.buildFilter { testObjectGenerator.entityAttributesFilter() }

        when:
        def result = filterService.createRepresentationFromFilter(filter)

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

    @TestConfiguration
    private static class JPAFSIConfig {
        @Bean
        JPAFilterServiceImpl jpaFilterServiceImpl(EntityDescriptorService entityDescriptorService, EntityService entityService, FilterTargetService filterTargetService) {
            return new JPAFilterServiceImpl().with {
                it.entityDescriptorService = entityDescriptorService
                it.entityService = entityService
                it.filterTargetService = filterTargetService
                it
            }
        }

        @Bean
        JPAFilterTargetServiceImpl jpaFilterTargetService() {
            return new JPAFilterTargetServiceImpl()
        }
    }
}