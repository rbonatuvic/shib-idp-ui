package edu.internet2.tier.shibboleth.admin.ui.repository

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.TestConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, TestConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
class FilterRepositoryTests extends Specification {

    @Autowired
    FilterRepository repositoryUnderTest

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
}
