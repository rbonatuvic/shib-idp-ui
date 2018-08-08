package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.File;
import java.util.Timer;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFilesystemMetadataResolver extends FilesystemMetadataResolver {
    private IndexWriter indexWriter;
    private LuceneMetadataResolverService luceneMetadataResolverService;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver sourceResolver;

    public OpenSamlFilesystemMetadataResolver(File metadataFile,
                                              IndexWriter indexWriter,
                                              LuceneMetadataResolverService luceneMetadataResolverService,
                                              edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver sourceResolver) throws ResolverException {
        super(metadataFile);
        this.indexWriter = indexWriter;
        this.luceneMetadataResolverService = luceneMetadataResolverService;
        this.sourceResolver = sourceResolver;
        //TODO: set other things from the resolver here
    }

    public OpenSamlFilesystemMetadataResolver(@Nonnull File metadata) throws ResolverException {
        super(metadata);
    }

    public OpenSamlFilesystemMetadataResolver(@Nullable Timer backgroundTaskTimer,
                                              @Nonnull File metadata) throws ResolverException {
        super(backgroundTaskTimer, metadata);
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

    public void setSourceResolver(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver sourceResolver) {
        this.sourceResolver = sourceResolver;
    }
}
