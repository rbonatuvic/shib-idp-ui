package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import java.io.IOException;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class FileBackedHttpMetadataResolver extends MetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(FileBackedHttpMetadataResolver.class);

    @Autowired
    LuceneMetadataResolverService luceneMetadataResolverService;

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

    public FileBackedHTTPMetadataResolver createOpenSamlResolver(IndexWriter indexWriter) throws ResolverException {
        final String resourceId = this.getResourceId();

        FileBackedHTTPMetadataResolver openSamlResolver = new FileBackedHTTPMetadataResolver(HttpClients.createMinimal(), this.metadataURL, this.backingFile) {
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

            // TODO: this is still probably not the best way to do this?
            @Override
            protected void processConditionalRetrievalHeaders(HttpResponse response) {
                // let's do nothing 'cause we want to allow a refresh
            }
        };
        return openSamlResolver;
    }
}
