package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.Embedded;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
public class FileBackedHttpMetadataResolver extends MetadataResolver {
    public FileBackedHttpMetadataResolver() {
        type = "FileBackedHttpMetadataResolver";
    }

    private String metadataURL;

    private String backingFile;

    private Boolean initializeFromBackupFile = true;

    private String backupFileInitNextRefreshDelay;


    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;

    @Embedded
    private HttpMetadataResolverAttributes httpMetadataResolverAttributes;
}
