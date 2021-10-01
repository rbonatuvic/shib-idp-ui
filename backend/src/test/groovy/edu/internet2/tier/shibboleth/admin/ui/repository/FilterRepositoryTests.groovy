package edu.internet2.tier.shibboleth.admin.ui.repository

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.util.TestObjectGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class FilterRepositoryTests extends AbstractBaseDataJpaTest {
    @Autowired
    FilterRepository filterRepository

    @Transactional
    def setup() {
        filterRepository.deleteAll()
    }

    def cleanup() {
        filterRepository.deleteAll()
    }

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
        def persistedFilter = filterRepository.save(filter)
        def item1 = filterRepository.findByResourceId("29a5d409-562a-41cd-acee-e9b3d7098d05")

        then:
        item1.hashCode() == persistedFilter.hashCode()
    }

    @WithMockAdmin
    def "NameIdFormatFilter is able to be persisted to RDBMS"() {
        given:
        def nameIdFormatFilter = TestObjectGenerator.nameIdFormatFilter()

        when:
        def persistedFilter = filterRepository.save(nameIdFormatFilter)

        then:
        persistedFilter.audId > 0L
        persistedFilter.formats.size() == 1
    }
}