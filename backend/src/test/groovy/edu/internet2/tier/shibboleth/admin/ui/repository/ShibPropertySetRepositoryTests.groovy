package edu.internet2.tier.shibboleth.admin.ui.repository

import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet
import org.springframework.beans.factory.annotation.Autowired

import javax.persistence.EntityManager

/**
 * Tests to validate the repo and model for ShibPropertySetRepository
 * Because of how JPA works, these are pretty basic and we put "real use" tests/logic
 * into the service that manages the sets
 *
 * @author chasegawa
 */
class ShibPropertySetRepositoryTests extends AbstractBaseDataJpaTest {
    @Autowired
    EntityManager entityManager

    @Autowired
    ShibPropertySetRepository repo

    def "basic CRUD operations validated"() {
        given:
        // No properties, just a blank set
        def set = new ShibPropertySet();
        set.setName("set1")

        // Confirm empty db state
        when:
        def allSets = repo.findAll()

        then:
        allSets.size() == 0

        // save check
        when:
        def savedSet = repo.save(set)
        entityManager.flush()
        entityManager.clear()

        then:
        def allSets2 = repo.findAll()
        allSets2.size() == 1

        // fetch checks
        def fetchedSet = repo.findByResourceId(savedSet.resourceId)
        savedSet.equals(fetchedSet)

        def fetchedByName = repo.findByName(savedSet.name)
        savedSet.equals(fetchedByName)

        // delete check
        when:
        repo.delete(set)
        entityManager.flush()
        entityManager.clear()
        def noSets =  repo.findAll()

        then:
        noSets.size() == 0
    }
}