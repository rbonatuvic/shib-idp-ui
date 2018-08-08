package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;

import javax.annotation.Nullable;
import java.util.Timer;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFileBackedHTTPMetadataResolver extends FileBackedHTTPMetadataResolver {
    private IndexWriter indexWriter;
    private LuceneMetadataResolverService luceneMetadataResolverService;
    private FileBackedHttpMetadataResolver sourceResolver;

    public OpenSamlFileBackedHTTPMetadataResolver(IndexWriter indexWriter,
                                                  LuceneMetadataResolverService luceneMetadataResolverService,
                                                  FileBackedHttpMetadataResolver sourceResolver) throws ResolverException {
        super(HttpClients.createMinimal(), sourceResolver.getMetadataURL(), sourceResolver.getBackingFile());
        this.indexWriter = indexWriter;
        this.luceneMetadataResolverService = luceneMetadataResolverService;
        this.sourceResolver = sourceResolver;
        //TODO: set other things from the resolver here
    }

    public OpenSamlFileBackedHTTPMetadataResolver(HttpClient client,
                                                  String metadataURL,
                                                  String backupFilePath) throws ResolverException {
        super(client, metadataURL, backupFilePath);
    }

    public OpenSamlFileBackedHTTPMetadataResolver(Timer backgroundTaskTimer,
                                                  HttpClient client,
                                                  String metadataURL,
                                                  String backupFilePath) throws ResolverException {
        super(backgroundTaskTimer, client, metadataURL, backupFilePath);
    }

    // TODO: this is still probably not the best way to do this?
    @Nullable
    @Override
    public DateTime getLastRefresh() {
        return null;
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();

        luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                                            this.sourceResolver.getResourceId(),
                                                                            indexWriter);
    }

    // TODO: this is still probably not the best way to do this?
    @Override
    protected void processConditionalRetrievalHeaders(HttpResponse response) {
        // let's do nothing 'cause we want to allow a refresh
    }

    public void setIndexWriter(IndexWriter indexWriter) {

        this.indexWriter = indexWriter;
    }

    public void setLuceneMetadataResolverService(LuceneMetadataResolverService luceneMetadataResolverService) {
        this.luceneMetadataResolverService = luceneMetadataResolverService;
    }

    public void setSourceResolver(FileBackedHttpMetadataResolver sourceResolver) {
        this.sourceResolver = sourceResolver;
    }
}
