package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Embedded;
import javax.persistence.Entity;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class FilesystemMetadataResolver extends MetadataResolver {
    public FilesystemMetadataResolver() {
        type = "FilesystemMetadataResolver";
        this.setDoInitialization(false);
    }

    private String metadataFile;

    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;
}
