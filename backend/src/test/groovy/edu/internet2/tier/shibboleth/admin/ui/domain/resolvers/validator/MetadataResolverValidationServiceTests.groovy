package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver
import spock.lang.Specification
import spock.lang.Subject

import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator.IMetadataResolverValidator.*

/**
 * @author Dmitriy Kopylenko
 */
class MetadataResolverValidationServiceTests extends Specification {

    def "Validation service with no available validators always returns default valid result"() {
        given: 'Sample metadata resolver and validation service with no validators'
        def resolver = Mock(MetadataResolver)
        @Subject
        def validationService = new MetadataResolverValidationService(null)

        when: 'Validation call is made'
        def validationResult = validationService.validateIfNecessary(resolver)

        then:
        validationResult.valid
    }

    def "Validation service with one validator not supporting the type of resolver returns default valid result"() {
        given: 'Sample metadata resolver and validation service with one validator not supporting that type'
        def resolver = Mock(MetadataResolver)
        def validator = Mock(IMetadataResolverValidator)
        validator.supports(_) >> false
        @Subject
        def validationService = new MetadataResolverValidationService([validator])

        when: 'Validation call is made'
        def validationResult = validationService.validateIfNecessary(resolver)

        then:
        validationResult.valid
    }

    def "Validation service with one validator supporting the type of resolver but fails its validation"() {
        given: 'Sample metadata resolver and validation service with one validator supporting that type'
        def resolver = Mock(MetadataResolver)
        def validator = Mock(IMetadataResolverValidator)
        validator.supports(_) >> true
        validator.validate(_) >> new ValidationResult('Invalid')
        @Subject
        def validationService = new MetadataResolverValidationService([validator])

        when: 'Validation call is made'
        def validationResult = validationService.validateIfNecessary(resolver)

        then:
        !validationResult.valid
    }

    def "Validation service with with two validators supporting the type of resolver, first fails, second passes validation"() {
        given: 'Sample metadata resolver and validation service with two validators supporting that type'
        def resolver = Mock(MetadataResolver)
        def validator1 = Mock(IMetadataResolverValidator)
        validator1.supports(_) >> true
        validator1.validate(_) >> new ValidationResult('Invalid')
        def validator2 = Mock(IMetadataResolverValidator)
        validator2.supports(_) >> true
        validator2.validate(_) >> new ValidationResult(null)
        @Subject
        def validationService = new MetadataResolverValidationService([validator1, validator2])

        when: 'Validation call is made'
        def validationResult = validationService.validateIfNecessary(resolver)

        then: 'Result depends on list order of validators if all of them support the resolver type. This would be considered a mis-configuration'
        !validationResult.valid
    }

    def "Validation service with with two validators, only one supporting the type of resolver, passes validation"() {
        given: 'Sample metadata resolver and validation service with two validators, with one supporting that type'
        def resolver = Mock(MetadataResolver)
        def validator1 = Mock(IMetadataResolverValidator)
        validator1.supports(_) >> false
        def validator2 = Mock(IMetadataResolverValidator)
        validator2.supports(_) >> true
        validator2.validate(_) >> new ValidationResult(null)
        @Subject
        def validationService = new MetadataResolverValidationService([validator1, validator2])

        when: 'Validation call is made'
        def validationResult = validationService.validateIfNecessary(resolver)

        then:
        validationResult.valid
    }
}