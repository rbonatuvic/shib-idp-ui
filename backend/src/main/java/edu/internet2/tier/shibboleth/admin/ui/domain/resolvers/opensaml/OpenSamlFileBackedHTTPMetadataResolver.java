package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.joda.time.chrono.ISOChronology;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static edu.internet2.tier.shibboleth.admin.util.DurationUtility.toMillis;
import static edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers.placeholderResolverService;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFileBackedHTTPMetadataResolver extends FileBackedHTTPMetadataResolver implements Refilterable {

    private static final Logger logger = LoggerFactory.getLogger(OpenSamlFileBackedHTTPMetadataResolver.class);

    private IndexWriter indexWriter;
    private FileBackedHttpMetadataResolver sourceResolver;

    private OpenSamlMetadataResolverDelegate delegate;

    public OpenSamlFileBackedHTTPMetadataResolver(ParserPool parserPool,
                                                  IndexWriter indexWriter,
                    FileBackedHttpMetadataResolver sourceResolver) throws ResolverException {
        super(HttpClients.createMinimal(), sourceResolver.getMetadataURL(), sourceResolver.getBackingFile());
        this.indexWriter = indexWriter;
        this.sourceResolver = sourceResolver;
        this.delegate = new OpenSamlMetadataResolverDelegate();

        this.setId(sourceResolver.getResourceId());

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromHttpMetadataResolverAttributes(this,
                        sourceResolver.getHttpMetadataResolverAttributes());
        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(this,
                        sourceResolver.getReloadableMetadataResolverAttributes(), parserPool);

        this.setBackupFile(placeholderResolverService().resolveValueFromPossibleTokenPlaceholder(sourceResolver.getBackingFile()));
        this.setBackupFileInitNextRefreshDelay(toMillis(placeholderResolverService()
                        .resolveValueFromPossibleTokenPlaceholder(sourceResolver.getBackupFileInitNextRefreshDelay())));
        if (sourceResolver.getInitializeFromBackupFile() != null) {
            this.setInitializeFromBackupFile(sourceResolver.getInitializeFromBackupFile());
        }

        this.setMetadataFilter(new MetadataFilterChain());

        // TODO: Where does this get set in OpenSAML land?
        // sourceResolver.getMetadataURL();
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

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();


        delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                       this.sourceResolver.getResourceId(),
                                                       indexWriter);
    }

    @Nonnull
    @Override
    protected BatchEntityBackingStore getBackingStore() {
        if (super.getBackingStore() == null) {
            super.setBackingStore(super.createNewBackingStore());
        }
        return super.getBackingStore();
    }

    /**
     * {@inheritDoc}
     */
    public void refilter() {
        try {
            this.getBackingStore().setCachedFilteredMetadata(filterMetadata(getCachedOriginalMetadata()));
        } catch (FilterException e) {
            logger.error("An error occurred while attempting to filter metadata!", e);
        }
    }

    //TODO: This is a band-aid for the negative refresh issue. This override should go away once we figure out
    // why the negative refresh is occurring.
    @Override
    public synchronized void refresh() throws ResolverException {
        // In case a destroy() thread beat this thread into the monitor.
        if (isDestroyed()) {
            return;
        }

        try {

            DateTime now = new DateTime(ISOChronology.getInstanceUTC());
            String mdId = getMetadataIdentifier();

            final byte[] mdBytes = fetchMetadata();
            if (mdBytes == null) {
                processCachedMetadata(mdId, now);
            } else {
                processNewMetadata(mdId, now, mdBytes);
            }
        } catch (final Throwable t) {
            if (t instanceof Exception) {
                throw new ResolverException((Exception) t);
            } else {
                throw new ResolverException(String.format("Saw an error of type '%s' with message '%s'",
                                                          t.getClass().getName(), t.getMessage()));
            }
        }
    }
}
