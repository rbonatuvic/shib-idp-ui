package edu.internet2.tier.shibboleth.admin.ui.repository

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.InternationalizationConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.CustomEntityAttributeDefinition
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.CustomEntityAttributeFilterValue
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator.*

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration, InternationalizationConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class FilterRepositoryTests extends Specification {

    @Autowired
    FilterRepository repositoryUnderTest

    @Autowired
    CustomEntityAttributeDefinitionRepository ceadRepo
    
    @Autowired
    CustomEntityAttributeFilterValueRepository ceafvRepo
    
    @Autowired
    EntityManager entityManager

    def "EntityAttributesFilter hashcode works as desired"() {
        given:
        def entityAttributesFilterJson = '''{
	"name": "EntityAttributes",
	"resourceId": "29a5d409-562a-41cd-acee-e9b3d7098d05",
	"filterEnabled": false,
	"entityAttributesFilterTarget": {
		"entityAttributesFilterTargetType": "CONDITION_SCRIPT",
		"value": [
			"TwUuSOz5O6"
		]
	},
	"attributeRelease": [
		"WbkhLQNI3m"
	],
	"relyingPartyOverrides": {
		"signAssertion": true,
		"dontSignResponse": true,
		"turnOffEncryption": true,
		"useSha": true,
		"ignoreAuthenticationMethod": false,
		"omitNotBefore": true,
		"responderId": null,
		"nameIdFormats": [
			"xLenUFmCLn"
		],
		"authenticationMethods": []
	},
	"@type": "EntityAttributes"
}'''

        when:
        def filter = new ObjectMapper().readValue(entityAttributesFilterJson.bytes, EntityAttributesFilter)
        def persistedFilter = repositoryUnderTest.save(filter)
        entityManager.flush()

        then:
        def item1 = repositoryUnderTest.findByResourceId(persistedFilter.resourceId)
        entityManager.clear()
        def item2 = repositoryUnderTest.findByResourceId(persistedFilter.resourceId)

        item1.hashCode() == item2.hashCode()
    }

    def "NameIdFormatFilter is able to be persisted to RDBMS"() {
        given:
        def nameIdFormatFilter = TestObjectGenerator.nameIdFormatFilter()

        when:
        def persistedFilter = repositoryUnderTest.save(nameIdFormatFilter)

        then:
        persistedFilter.audId > 0L
        persistedFilter.formats.size() == 1
    }
    
    def "FilterRepository + EntityAttributesFilter CRUD ops with custom entity attributes correctly"(){
        given:
        def ca = new CustomEntityAttributeDefinition().with {
            it.name = "ca-name"
            it.attributeType = "STRING"
            it.defaultValue = "foo"
            it
        }
        ceadRepo.save(ca)
        entityManager.flush()
        entityManager.clear()
        
        def entityAttributesFilterJson = '''{
            "name": "EntityAttributes",
            "resourceId": "29a5d409-562a-41cd-acee-e9b3d7098d05",
            "filterEnabled": false,
            "entityAttributesFilterTarget": {
                "entityAttributesFilterTargetType": "CONDITION_SCRIPT",
                "value": [
                    "TwUuSOz5O6"
                ]
            },
            "attributeRelease": [
                "WbkhLQNI3m"
            ],
            "relyingPartyOverrides": {
                "signAssertion": true,
                "dontSignResponse": true,
                "turnOffEncryption": true,
                "useSha": true,
                "ignoreAuthenticationMethod": false,
                "omitNotBefore": true,
                "responderId": null,
                "nameIdFormats": [
                    "xLenUFmCLn"
                ],
                "authenticationMethods": []
            },
            "@type": "EntityAttributes"
        }'''
        def filter = new ObjectMapper().readValue(entityAttributesFilterJson.bytes, EntityAttributesFilter.class)
        def persistedFilter = repositoryUnderTest.save(filter)
        entityManager.flush()
        
        def savedFilter = repositoryUnderTest.findByResourceId(persistedFilter.resourceId)
        def saveEAD = ceadRepo.findByName("ca-name");
        
        def ceafv = new CustomEntityAttributeFilterValue().with {
            it.entityAttributesFilter = savedFilter
            it.customEntityAttributeDefinition = saveEAD
            it.value = "bar"
            it
        }
        
        def customEntityAttributes = new HashSet()
        
        when: 
        customEntityAttributes.add(ceafv) // nothing to do yet, just here to let us verify nothing in the CEAFV table in 'then' block
        
        then: 
        ((Set)ceafvRepo.findAll()).size() == 0 //nothing yet
        ((EntityAttributesFilter)savedFilter).setCustomEntityAttributes(customEntityAttributes)
        repositoryUnderTest.save(savedFilter)
        entityManager.flush()
        
        then:
        def listOfceafv = ceafvRepo.findAll()
        listOfceafv.size() == 1
        
        def ceafvFromDb = listOfceafv.get(0).asType(CustomEntityAttributeFilterValue)
        ceafvFromDb.getEntityAttributesFilter().getResourceId().equals("29a5d409-562a-41cd-acee-e9b3d7098d05")
        
        def filterFromDb = (EntityAttributesFilter) repositoryUnderTest.findByResourceId("29a5d409-562a-41cd-acee-e9b3d7098d05")
        filterFromDb.getCustomEntityAttributes().size() == 1
        
        // now remove all 
        def emptySet = new HashSet()
        filterFromDb.setCustomEntityAttributes(emptySet)
        repositoryUnderTest.save(filterFromDb)
        entityManager.flush()
        
        ceafvRepo.findAll().size() == 0
    }    
}
