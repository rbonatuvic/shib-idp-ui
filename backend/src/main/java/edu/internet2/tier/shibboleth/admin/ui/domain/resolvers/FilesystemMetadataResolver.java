package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.http.HttpResponse;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import java.io.File;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class FilesystemMetadataResolver extends MetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(FilesystemMetadataResolver.class);

    @Autowired
    LuceneMetadataResolverService luceneMetadataResolverService;

    public FilesystemMetadataResolver() {
        type = "FilesystemMetadataResolver";
    }

    private String metadataFile;

    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;

    public org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver createOpenSamlResolver(IndexWriter indexWriter) throws ResolverException {
        File metadataFile = new File(this.metadataFile);

        final String resourceId = this.getResourceId();

        org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver openSamlResolver = new org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver(metadataFile) {
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver();

                luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(), resourceId, indexWriter);
            }

            // TODO: this is still probably not the best way to do this?
            @Nullable
            @Override
            public DateTime getLastRefresh() {
                return null;
            }
        };
        return openSamlResolver;
    }
}
