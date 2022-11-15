package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.validator

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ClasspathMetadataResource
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.SvnMetadataResource
import spock.lang.Specification

class ResourceBackedMetadataValidatorTests extends Specification {

    def "Does not support foreign resolver type"() {
        given:
        IMetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedIMetadataResolverValidator()
        FileBackedHttpMetadataResolver resolver = new FileBackedHttpMetadataResolver()

        expect:
        !validator.supports(resolver)
    }

    def "Passes validation"() {
        given:
        IMetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedIMetadataResolverValidator()
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
        IMetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedIMetadataResolverValidator()
        ResourceBackedMetadataResolver resolver = new ResourceBackedMetadataResolver()

        expect:
        validator.supports(resolver)
        !validator.validate(resolver).valid
    }

    def "Does not pass validation with both resource types present"() {
        given:
        IMetadataResolverValidator<ResourceBackedMetadataResolver> validator = new ResourceBackedIMetadataResolverValidator()
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