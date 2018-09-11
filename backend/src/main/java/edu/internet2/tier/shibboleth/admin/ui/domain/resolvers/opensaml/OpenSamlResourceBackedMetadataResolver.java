package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resource.Resource;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain;
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nullable;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlResourceBackedMetadataResolver extends ResourceBackedMetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(OpenSamlResourceBackedMetadataResolver.class);

    private IndexWriter indexWriter;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver;
    private OpenSamlMetadataResolverDelegate delegate;
    private OpenSamlBatchMetadataResolverDelegate batchDelegate;

    public OpenSamlResourceBackedMetadataResolver(ParserPool parserPool,
                                                  IndexWriter indexWriter,
                                                  edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver,
                                                  Resource resource) throws IOException {
        super(resource);
        this.indexWriter = indexWriter;
        this.sourceResolver = sourceResolver;
        this.delegate = new OpenSamlMetadataResolverDelegate();
        this.batchDelegate = new OpenSamlBatchMetadataResolverDelegate();

        this.setId(sourceResolver.getResourceId());

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(
                this, sourceResolver.getReloadableMetadataResolverAttributes(), parserPool);

        //TODO: check if this is the right thing to do
        this.setMetadataFilter(new MetadataFilterChain());
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

        delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                       this.sourceResolver.getResourceId(),
                                                       indexWriter);
    }

    public void refilter() {
        try {
            batchDelegate.refilter(this.getBackingStore(), filterMetadata(getCachedOriginalMetadata()));
        } catch (FilterException e) {
            logger.error("An error occurred while attempting to filter metadata!", e);
        }
    }
}
