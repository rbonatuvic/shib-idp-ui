package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import edu.internet2.tier.shibboleth.admin.ui.configuration.TestMetadataResolverValidationConfiguration
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.test.context.ContextConfiguration
import spock.lang.Specification

/**
 * @author Dmitriy Kopylenko
 */
@ContextConfiguration(classes=[TestMetadataResolverValidationConfiguration])
class MetadataResolverValidationServiceConfigurationTests extends Specification {

    @Autowired
    @Qualifier("metadataResolverValidationServiceEmpty")
    MetadataResolverValidationService metadataResolverValidationServiceNoValidators

    @Autowired
    @Qualifier("metadataResolverValidationServiceOneValidator")
    MetadataResolverValidationService metadataResolverValidationServiceOneValidator

    def "Validation service with no validators"() {
        expect:
        metadataResolverValidationServiceNoValidators.noValidatorsConfigured()
    }

    def "Validation service with one validator"() {
        expect:
        !metadataResolverValidationServiceOneValidator.noValidatorsConfigured()
    }
}