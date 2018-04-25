package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class JPAFilterTargetServiceImplTests extends Specification {

    RandomGenerator randomGenerator
    TestObjectGenerator testObjectGenerator

    JPAFilterTargetServiceImpl service

    def setup() {
        randomGenerator = new RandomGenerator()
        testObjectGenerator = new TestObjectGenerator()
        service = new JPAFilterTargetServiceImpl()
    }

    def "createFilterTargetFromRepresentation properly creates a filter target"() {
        given:
        def representation = testObjectGenerator.buildFilterTargetRepresentation()

        when:
        def results = service.createFilterTargetFromRepresentation(representation)

        then:
        results.value == representation.value
        results.entityAttributesFilterTargetType.toString() == representation.getType()
    }

    def "createRepresentationFromFilterTarget properly creates a representation from a filter target"() {
        given:
        def filterTarget = testObjectGenerator.buildEntityAttributesFilterTarget()

        when:
        def results = service.createRepresentationFromFilterTarget(filterTarget)

        then:
        results.value == filterTarget.value
        results.type == filterTarget.entityAttributesFilterTargetType.toString()
    }
}
