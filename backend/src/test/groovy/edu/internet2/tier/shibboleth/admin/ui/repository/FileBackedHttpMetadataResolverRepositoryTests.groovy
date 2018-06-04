package edu.internet2.tier.shibboleth.admin.ui.repository

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.CoreShibUiConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.MetadataResolverConfiguration
import edu.internet2.tier.shibboleth.admin.ui.configuration.SearchConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ReloadableMetadataResolverAttributes
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

import javax.persistence.EntityManager

import static edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget.EntityAttributesFilterTargetType.ENTITY
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.HttpMetadataResolverAttributes.HttpCachingType.memory

@DataJpaTest
@ContextConfiguration(classes=[CoreShibUiConfiguration, SearchConfiguration, MetadataResolverConfiguration])
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@DirtiesContext(methodMode = DirtiesContext.MethodMode.BEFORE_METHOD)
class FileBackedHttpMetadataResolverRepositoryTests extends Specification {

    @Autowired
    FileBackedHttpMetadataResolverRepository repositoryUnderTest

    @Autowired
    EntityManager entityManager

    def "file backed http metadata resolver instances persist OK"() {
        when:
        def mdr = new FileBackedHttpMetadataResolver().with {
            it.name = "FileBackedHttpMetadata"

            it.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes().with {
                it.connectionRequestTimeout = "PT05"
                it.disregardTLSCertificate = true
                it.httpCaching = memory
                it
            }
            it.reloadableMetadataResolverAttributes = new ReloadableMetadataResolverAttributes().with {
                it.indexesRef = "indexesSpringBeanId"
                it
            }

            it.metadataFilters.add(new EntityAttributesFilter().with {
                it.entityAttributesFilterTarget = new EntityAttributesFilterTarget().with {
                    it.entityAttributesFilterTargetType = ENTITY
                    it.setSingleValue(["hola"])
                    it
                }
                it
            })
            it
        }
        repositoryUnderTest.save(mdr)

        then:
        repositoryUnderTest.findAll().size() > 0
        FileBackedHttpMetadataResolver item = repositoryUnderTest.findByName("FileBackedHttpMetadata")

        item.name == "FileBackedHttpMetadata"
        item.metadataFilters.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.entityAttributesFilterTargetType == ENTITY
        item.metadataFilters[0].entityAttributesFilterTarget.setSingleValue.size() == 1
        item.metadataFilters[0].entityAttributesFilterTarget.setSingleValue.get(0) == "hola"
        item.httpMetadataResolverAttributes.connectionRequestTimeout == "PT05"
        item.httpMetadataResolverAttributes.disregardTLSCertificate
        item.httpMetadataResolverAttributes.httpCaching == memory
        item.reloadableMetadataResolverAttributes.indexesRef == "indexesSpringBeanId"
    }

    def "FileBackedHttpMetadataResolver hashcode works as desired"() {
        given:
        // TODO: There is weirdness here if reloadableMetadataResolverAttributes is empty.
        // I suspect similar weirdness if httpMetadataResolverAttributes is an empty object, too.
        def resolverJson = '''{
	"name": "name",
	"requireValidMetadata": true,
	"failFastInitialization": true,
	"sortKey": 7,
	"criterionPredicateRegistryRef": "criterionPredicateRegistryRef",
	"useDefaultPredicateRegistry": true,
	"satisfyAnyPredicates": true,
	"metadataFilters": [],
	"reloadableMetadataResolverAttributes": {
	    "parserPoolRef": "parserPoolRef"
	},
	"httpMetadataResolverAttributes": {
		"httpClientRef": "httpClientRef",
		"connectionRequestTimeout": "connectionRequestTimeout",
		"requestTimeout": "requestTimeout",
		"socketTimeout": "socketTimeout",
		"disregardTLSCertificate": true,
		"tlsTrustEngineRef": "tlsTrustEngineRef",
		"httpClientSecurityParametersRef": "httpClientSecurityParametersRef",
		"proxyHost": "proxyHost",
		"proxyPort": "proxyPort",
		"proxyUser": "proxyUser",
		"proxyPassword": "proxyPassword",
		"httpCaching": "none",
		"httpCacheDirectory": "httpCacheDirectory",
	    "httpMaxCacheEntries": 1,
		"httpMaxCacheEntrySize": 2
	}
}'''

        when:
        def resolver = new ObjectMapper().readValue(resolverJson.bytes, FileBackedHttpMetadataResolver)
        def persistedResolver = repositoryUnderTest.save(resolver)
        entityManager.flush()

        then:
        def item1 = repositoryUnderTest.findByResourceId(persistedResolver.resourceId)
        entityManager.clear()
        def item2 = repositoryUnderTest.findByResourceId(persistedResolver.resourceId)

        item1.hashCode() == item2.hashCode()
    }
}
