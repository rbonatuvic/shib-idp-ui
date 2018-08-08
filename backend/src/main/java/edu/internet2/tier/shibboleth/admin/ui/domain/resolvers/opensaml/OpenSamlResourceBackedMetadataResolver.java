package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resource.Resource;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver;

import javax.annotation.Nullable;
import java.io.IOException;
import java.util.Timer;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlResourceBackedMetadataResolver extends ResourceBackedMetadataResolver {
    private IndexWriter indexWriter;
    private LuceneMetadataResolverService luceneMetadataResolverService;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver;

    public OpenSamlResourceBackedMetadataResolver(Resource resource,
                                                  IndexWriter indexWriter,
                                                  LuceneMetadataResolverService luceneMetadataResolverService,
                                                  edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver) throws IOException {
        super(resource);
        this.indexWriter = indexWriter;
        this.luceneMetadataResolverService = luceneMetadataResolverService;
        this.sourceResolver = sourceResolver;
        //TODO: set other things from the resolver here
    }

    public OpenSamlResourceBackedMetadataResolver(Timer timer, Resource resource) throws IOException {
        super(timer, resource);
    }

    public OpenSamlResourceBackedMetadataResolver(Resource resource) throws IOException {
        super(resource);
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

    public void setIndexWriter(IndexWriter indexWriter) {

        this.indexWriter = indexWriter;
    }

    public void setLuceneMetadataResolverService(LuceneMetadataResolverService luceneMetadataResolverService) {
        this.luceneMetadataResolverService = luceneMetadataResolverService;
    }

    public void setSourceResolver(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver) {
        this.sourceResolver = sourceResolver;
    }
}
