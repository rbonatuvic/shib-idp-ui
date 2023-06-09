package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Embedded;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class FileBackedHttpMetadataResolver extends MetadataResolver {
    public FileBackedHttpMetadataResolver() {
        type = "FileBackedHttpMetadataResolver";
    }

    private String metadataURL;

    private String backingFile;

    private Boolean initializeFromBackupFile;

    private String backupFileInitNextRefreshDelay;


    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;

    @Embedded
    private HttpMetadataResolverAttributes httpMetadataResolverAttributes;
}