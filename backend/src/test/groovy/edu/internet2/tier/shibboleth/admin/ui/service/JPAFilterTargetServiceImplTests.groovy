package edu.internet2.tier.shibboleth.admin.ui.service

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.springframework.beans.factory.annotation.Autowired

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class JPAFilterTargetServiceImplTests extends AbstractBaseDataJpaTest {
    @Autowired
    TestObjectGenerator testObjectGenerator

    RandomGenerator randomGenerator
    JPAFilterTargetServiceImpl service

    def setup() {
        randomGenerator = new RandomGenerator()
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
        results.version == filterTarget.hashCode()
    }
}