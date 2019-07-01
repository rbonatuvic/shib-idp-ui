package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Embedded;
import javax.persistence.Entity;

import org.hibernate.envers.Audited;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class LocalDynamicMetadataResolver extends MetadataResolver {
    public LocalDynamicMetadataResolver() {
        type = "LocalDynamicMetadataResolver";
        setDoInitialization(false);
    }

    private String sourceDirectory;

    private String sourceManagerRef;

    private String sourceKeyGeneratorRef;

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;
}
