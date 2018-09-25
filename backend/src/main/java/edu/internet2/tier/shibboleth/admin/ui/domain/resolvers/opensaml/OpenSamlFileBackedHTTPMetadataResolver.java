package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.chrono.ISOChronology;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromHttpMetadataResolverAttributes(
                this, sourceResolver.getHttpMetadataResolverAttributes());
        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(
                this, sourceResolver.getReloadableMetadataResolverAttributes(), parserPool);

        this.setBackupFile(placeholderResolverService()
                .resolveValueFromPossibleTokenPlaceholder(sourceResolver.getBackingFile()));
        this.setBackupFileInitNextRefreshDelay(toMillis(placeholderResolverService()
                .resolveValueFromPossibleTokenPlaceholder(sourceResolver.getBackupFileInitNextRefreshDelay())));

        this.setInitializeFromBackupFile(sourceResolver.getInitializeFromBackupFile());

        this.setMetadataFilter(new MetadataFilterChain());

        //TODO: Where does this get set in OpenSAML land?
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
        DateTime now = null;
        String mdId = null;
        // boolean trackRefreshSuccess = false;

        try {
            // In case a destroy() thread beat this thread into the monitor.
            if (isDestroyed()) {
                return;
            }

            // A manual refresh() must cancel the previously-scheduled future task, since will (re)schedule its own.
            // If this execution *is* the task, it's ok to cancel ourself, we're already running.
            /*if (refreshMetadataTask != null) {
                refreshMetadataTask.cancel();
            }*/

            now = new DateTime(ISOChronology.getInstanceUTC());
            mdId = getMetadataIdentifier();

            // log.debug("{} Beginning refresh of metadata from '{}'", getLogPrefix(), mdId);

            final byte[] mdBytes = fetchMetadata();
            if (mdBytes == null) {
                // log.info("{} Metadata from '{}' has not changed since last refresh", getLogPrefix(), mdId);
                processCachedMetadata(mdId, now);
            } else {
                // log.debug("{} Processing new metadata from '{}'", getLogPrefix(), mdId);
                processNewMetadata(mdId, now, mdBytes);
            }
        } catch (final Throwable t) {
            // trackRefreshSuccess = false;
            // log.error("{} Error occurred while attempting to refresh metadata from '{}'", getLogPrefix(), mdId, t);
            // nextRefresh = new DateTime(ISOChronology.getInstanceUTC()).plus(minRefreshDelay);
            if (t instanceof Exception) {
                throw new ResolverException((Exception) t);
            } else {
                throw new ResolverException(String.format("Saw an error of type '%s' with message '%s'",
                                                          t.getClass().getName(), t.getMessage()));
            }
        } /*finally {
            // logCachedMetadataExpiration(now);

            if (trackRefreshSuccess) {
                wasLastRefreshSuccess = true;
                lastSuccessfulRefresh = now;
            } else {
                wasLastRefreshSuccess = false;
            }

            refreshMetadataTask = new RefreshMetadataTask();
            final long nextRefreshDelay = nextRefresh.getMillis() - System.currentTimeMillis();
            // taskTimer.schedule(refreshMetadataTask, nextRefreshDelay);
            log.info("{} Next refresh cycle for metadata provider '{}' will occur on '{}' ('{}' local time)",
                     new Object[] {getLogPrefix(), mdId, nextRefresh,
                             nextRefresh.toDateTime(DateTimeZone.getDefault()),});
            lastRefresh = now;
        }*/
    }
}
