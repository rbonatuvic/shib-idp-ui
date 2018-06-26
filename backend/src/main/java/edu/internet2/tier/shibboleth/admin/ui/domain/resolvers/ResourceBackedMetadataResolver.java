package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Embedded;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
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
}
