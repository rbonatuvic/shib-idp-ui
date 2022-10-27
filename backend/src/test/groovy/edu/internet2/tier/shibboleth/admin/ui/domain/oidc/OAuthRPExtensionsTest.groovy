package edu.internet2.tier.shibboleth.admin.ui.domain.oidc

import com.fasterxml.jackson.databind.ObjectMapper
import edu.internet2.tier.shibboleth.admin.ui.AbstractBaseDataJpaTest
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService
import edu.internet2.tier.shibboleth.admin.ui.service.JPAEntityDescriptorServiceImpl
import edu.internet2.tier.shibboleth.admin.ui.util.RandomGenerator
import edu.internet2.tier.shibboleth.admin.ui.util.WithMockAdmin
import edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.json.JacksonTester
import org.springframework.context.annotation.PropertySource
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager

@PropertySource("classpath:application.yml")
class OAuthRPExtensionsTest extends AbstractBaseDataJpaTest {
    @Autowired
    EntityService entityService

    @Autowired
    OpenSamlObjects openSamlObjects

    @Autowired
    JPAEntityDescriptorServiceImpl service

    @Autowired
    EntityManager entityManager

    def setup() {
        EntityDescriptorConversionUtils.openSamlObjects = openSamlObjects
        EntityDescriptorConversionUtils.entityService = entityService
        openSamlObjects.init()
    }

    @WithMockAdmin
    def "hashcode tests"() {
        when:
        def representation = new ObjectMapper().readValue(this.class.getResource('/json/SHIBUI-2380.json').bytes, EntityDescriptorRepresentation)
        def edRep = service.createNew(representation)
        entityManager.flush()
        def ed1 = service.getEntityDescriptorByResourceId(edRep.getId())
        entityManager.clear()
        def ed2 = service.getEntityDescriptorByResourceId(edRep.getId())

        def oauthRpExt1 = (OAuthRPExtensions) ed1.getSPSSODescriptor("").getExtensions().getOrderedChildren().get(0)
        def oauthRpExt2 = (OAuthRPExtensions) ed2.getSPSSODescriptor("").getExtensions().getOrderedChildren().get(0)

        then:
        oauthRpExt1.hashCode() == oauthRpExt2.hashCode()
    }
}