package edu.internet2.tier.shibboleth.admin.ui.domain

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import spock.lang.Specification

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
class EntityAttributesFilterTargetTests extends Specification {

    def "when setValue is passed a list, it sets the list"() {
        given:
        def filterTarget = new EntityAttributesFilterTarget()
        def stringsList = ["one", "two", "three"]

        when:
        filterTarget.setSingleValue(stringsList)

        then:
        filterTarget.value == stringsList
    }

    def "when setValue is passed a single string, it creates a new list with that string"() {
        given:
        def filterTarget = new EntityAttributesFilterTarget()
        def someString = "someString"
        def expectedList = [someString]

        when:
        filterTarget.setSingleValue(someString)

        then:
        filterTarget.value.size() == 1
        filterTarget.value == expectedList
    }
}
