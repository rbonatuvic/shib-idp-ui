package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Embedded;
import javax.persistence.Entity;

import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.CLASSPATH;
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.SVN;

@Entity
@EqualsAndHashCode(callSuper = true, exclude = "resourceType")
@Getter
@Setter
@ToString
public class ResourceBackedMetadataResolver extends MetadataResolver {

    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;

    @Embedded
    private ClasspathMetadataResource classpathMetadataResource;

    @Embedded
    private SvnMetadataResource svnMetadataResource;

    public ResourceType validateAndDetermineResourceType() throws InvalidResourceTypeException {
        if (classpathMetadataResource == null && svnMetadataResource == null) {
            throw new InvalidResourceTypeException("No metadata resource is provided. Exactly one is required");
        }
        if (classpathMetadataResource != null && svnMetadataResource != null) {
            throw new InvalidResourceTypeException("Too many metadata resources are provided. Exactly one is required");
        }
        return classpathMetadataResource != null ? CLASSPATH : SVN;
    }

    public class InvalidResourceTypeException extends IllegalStateException {
        public InvalidResourceTypeException(String s) {
            super(s);
        }
    }

    public enum ResourceType {
        CLASSPATH,
        SVN
    }
}
