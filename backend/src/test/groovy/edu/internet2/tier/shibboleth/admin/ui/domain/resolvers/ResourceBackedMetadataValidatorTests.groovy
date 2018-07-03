package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers

import spock.lang.Specification

class ResourceBackedMetadataValidatorTests extends Specification {

    def "Does not support foreign resolver type"() {
        given:
        MetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedMetadataResolverValidator()
        FileBackedHttpMetadataResolver resolver = new FileBackedHttpMetadataResolver()

        expect:
        !validator.supports(resolver)
    }

    def "Passes validation"() {
        given:
        MetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedMetadataResolverValidator()
        ResourceBackedMetadataResolver resolver = new ResourceBackedMetadataResolver().with {
            it.classpathMetadataResource = new ClasspathMetadataResource()
            it
        }

        expect:
        validator.supports(resolver)
        validator.validate(resolver).valid
    }

    def "Does not pass validation with both resource types missing"() {
        given:
        MetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedMetadataResolverValidator()
        ResourceBackedMetadataResolver resolver = new ResourceBackedMetadataResolver()

        expect:
        validator.supports(resolver)
        !validator.validate(resolver).valid
    }

    def "Does not pass validation with both resource types present"() {
        given:
        MetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedMetadataResolverValidator()
        ResourceBackedMetadataResolver resolver = new ResourceBackedMetadataResolver().with {
            it.classpathMetadataResource = new ClasspathMetadataResource()
            it.svnMetadataResource = new SvnMetadataResource()
            it
        }

        expect:
        validator.supports(resolver)
        !validator.validate(resolver).valid
    }
}
