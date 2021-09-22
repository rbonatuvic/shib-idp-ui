package edu.internet2.tier.shibboleth.admin.ui.repository

import com.fasterxml.jackson.databind.MapperFeature
import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.configuration.ShibUIConfiguration
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBundle
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

@DataJpaTest
@EnableJpaRepositories(basePackages = ["edu.internet2.tier.shibboleth.admin.ui"])
@EntityScan("edu.internet2.tier.shibboleth.admin.ui")
@ContextConfiguration(classes = [ShibUIConfiguration])
class AttributeBundleRepositoryTests extends Specification {
    @Autowired
    AttributeBundleRepository attributeBundleRepository

    ObjectMapper objectMapper = new ObjectMapper()

    def "test create and fetch" () {
        given:
        def json = """            
              {
	            "name": "bundleName",
	            "resourceId": "randomIDVal",
	            "attributes": ["eduPersonPrincipalName", "surname", "givenName"]
              }                
        """

        AttributeBundle bundle = objectMapper.readValue(json, AttributeBundle.class)

        when:
        def result = attributeBundleRepository.save(bundle)

        then:
        result == bundle
    }
}