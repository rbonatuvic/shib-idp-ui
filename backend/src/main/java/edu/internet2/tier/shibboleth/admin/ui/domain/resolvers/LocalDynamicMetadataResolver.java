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
public class LocalDynamicMetadataResolver extends MetadataResolver {

    public LocalDynamicMetadataResolver() {
        type = "LocalDynamicMetadataResolver";
    }

    private String sourceDirectory;

    private String sourceManagerRef;

    private String sourceKeyGeneratorRef;

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;

}
