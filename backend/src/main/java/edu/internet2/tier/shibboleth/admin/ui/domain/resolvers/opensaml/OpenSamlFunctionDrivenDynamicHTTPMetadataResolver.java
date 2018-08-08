package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.saml.metadata.resolver.impl.FunctionDrivenDynamicHTTPMetadataResolver;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Timer;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFunctionDrivenDynamicHTTPMetadataResolver extends FunctionDrivenDynamicHTTPMetadataResolver {
    private IndexWriter indexWriter;
    private LuceneMetadataResolverService luceneMetadataResolverService;
    private DynamicHttpMetadataResolver sourceResolver;

    public OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(IndexWriter indexWriter,
                                                             LuceneMetadataResolverService luceneMetadataResolverService,
                                                             DynamicHttpMetadataResolver sourceResolver) {
        super(HttpClients.createMinimal());
        this.indexWriter = indexWriter;
        this.luceneMetadataResolverService = luceneMetadataResolverService;
        this.sourceResolver = sourceResolver;
        //TODO: set other things from the resolver here
    }

    public OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(HttpClient client) {
        super(client);
    }

    public OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(@Nullable Timer backgroundTaskTimer,
                                                             @Nonnull HttpClient client) {
        super(backgroundTaskTimer, client);
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();

        luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                                            this.sourceResolver.getResourceId(),
                                                                            indexWriter);
    }

    public void setIndexWriter(IndexWriter indexWriter) {
        this.indexWriter = indexWriter;
    }

    public void setLuceneMetadataResolverService(LuceneMetadataResolverService luceneMetadataResolverService) {
        this.luceneMetadataResolverService = luceneMetadataResolverService;
    }

    public void setSourceResolver(DynamicHttpMetadataResolver sourceResolver) {
        this.sourceResolver = sourceResolver;
    }
}
