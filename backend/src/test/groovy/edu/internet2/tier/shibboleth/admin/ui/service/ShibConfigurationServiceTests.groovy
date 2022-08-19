package edu.internet2.tier.shibboleth.admin.ui.service

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySet
import edu.internet2.tier.shibboleth.admin.ui.domain.shib.properties.ShibPropertySetting
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySetRepository
import edu.internet2.tier.shibboleth.admin.ui.repository.ShibPropertySettingRepository
import org.springframework.beans.factory.annotation.Autowired

import javax.persistence.EntityManager
import javax.transaction.Transactional

class ShibConfigurationServiceTests extends AbstractBaseDataJpaTest {
    @Autowired
    EntityManager entityManager

    @Autowired
    ShibPropertySetRepository propertySetRepo

    @Autowired
    ShibPropertySettingRepository propertySettingRepo

    @Autowired
    ShibConfigurationService service

    def defaultSetResourceId

    /**
     * We use the object mapper to transform to json and then back to new objects so that what we send to the service is never
     * the actual hibernate entity from the db, but an unattached copy (ie what the service would be getting as input in reality)
     */
    def ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    def setup() {
        ShibPropertySetting prop1 = new ShibPropertySetting().with { it ->
            it.propertyName = 'foo'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'bar'

            it
        }
        ShibPropertySetting prop1Saved = propertySettingRepo.save(prop1)
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'foo2'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'bar2'

            it
        }
        ShibPropertySetting prop2Saved = propertySettingRepo.save(prop2)
        entityManager.flush()
        entityManager.clear()

        ArrayList<ShibPropertySetting> values = new ArrayList<>()
        values.add(prop1Saved)
        values.add(prop2Saved)
        def set = new ShibPropertySet()
        set.setName("set1")
        set.setProperties(values)
        def savedSet = propertySetRepo.save(set)
        entityManager.flush()
        entityManager.clear()

        defaultSetResourceId = savedSet.resourceId
    }

    def "check delete"() {
        given:
        def long setCount = propertySetRepo.count()
        def long propsCount = propertySettingRepo.count()

        expect:
        setCount == 1
        propsCount == 2

        when:
        service.delete(defaultSetResourceId)

        then:
        propertySetRepo.count() == 0
        propertySettingRepo.count() == 0
    }

    def "create new using the service"() {
        when:
        ShibPropertySetting prop = new ShibPropertySetting().with { it ->
            it.propertyName = 'food.for.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'

            it
        }
        ShibPropertySetting prop2 = new ShibPropertySetting().with { it ->
            it.propertyName = 'food2.for2.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'

            it
        }
        ShibPropertySet set = new ShibPropertySet().with {it ->
            it.properties.add(prop)
            it.properties.add(prop2)
            it.name = 'somerandom'

            it
        }
        service.create(set)
        ShibPropertySet dbSet = propertySetRepo.findByName("somerandom")

        then:
        dbSet.properties.size() == 2
    }

    def "update using the service (add and delete properties)"() {
        when:
        def defaultSet = propertySetRepo.findByResourceId(defaultSetResourceId)
        ShibPropertySetting prop = new ShibPropertySetting().with { it ->
            it.propertyName = 'food.for.thought'
            it.configFile = 'defaults.properties'
            it.propertyValue = 'true'

            it
        }

        defaultSet.properties.add(prop)
        // create a copy of the set so they can't possibly be real db entities
        def copySet = objectMapper.readValue(objectMapper.writeValueAsString(defaultSet), ShibPropertySet.class)
        service.update(copySet)
        def updatedSet = propertySetRepo.findByResourceId(defaultSetResourceId)

        then:
        updatedSet.properties.size() == 3

        when:
        updatedSet.properties.remove(0)
        service.update(objectMapper.readValue(objectMapper.writeValueAsString(updatedSet), ShibPropertySet.class))
        def updatedSet2 = propertySetRepo.findByResourceId(defaultSetResourceId)

        then:
        updatedSet2.properties.size() == 2
    }

    def "fetch with the service"() {
        when:
        def sets = service.getAllPropertySets()

        then:
        sets.size() == 1
        def set = sets.get(0)
        set.getName().equals("set1")

        when:
        def theSet = service.getSet(Integer.parseInt(set.getResourceId()))

        then:
        theSet.getName().equals("set1")
        theSet.getProperties().size() == 2
    }

}