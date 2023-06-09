package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.saml.metadata.resolver.filter.FilterException;
import org.opensaml.saml.metadata.resolver.filter.MetadataFilterChain;
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.File;
import java.time.Instant;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFilesystemMetadataResolver extends FilesystemMetadataResolver implements Refilterable {

    private static final Logger logger = LoggerFactory.getLogger(OpenSamlFilesystemMetadataResolver.class);

    private IndexWriter indexWriter;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver sourceResolver;
    private OpenSamlMetadataResolverDelegate delegate;

    public OpenSamlFilesystemMetadataResolver(ParserPool parserPool,
                                              IndexWriter indexWriter,
                                              edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver sourceResolver,
                                              File metadataFile) throws ResolverException {
        super(metadataFile);
        this.indexWriter = indexWriter;
        this.sourceResolver = sourceResolver;
        this.delegate = new OpenSamlMetadataResolverDelegate();

        this.setId(sourceResolver.getResourceId());

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromReloadableMetadataResolverAttributes(
                this, sourceResolver.getReloadableMetadataResolverAttributes(), parserPool);

        this.setMetadataFilter(new MetadataFilterChain());
    }

    // TODO: this is still probably not the best way to do this?
    @Nullable
    @Override
    public Instant getLastRefresh() {
        return null;
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        //Necessary to make sure backing store is initialized by the super class to avoid NPE during re-filtering
        try {
            setBackingStore(createNewBackingStore());
        }
        catch(Throwable e) {
            logger.warn("Error caught and ignored during initialization necessary to init backingStore", e);
        }

        if (this.sourceResolver.getDoInitialization()) {
            super.initMetadataResolver();
            delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                    this.sourceResolver.getResourceId(),
                    indexWriter);
        }
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

    @Override
    public void validateMetadataFile(@Nonnull final File file) throws ResolverException {
        // NOPE, not going to validate this because the file reference is likely not to exist on the shibui server nor even be a
        // valid path on the running server. The file is needed for the XML, but we shouldn't be validating it.
    }

    @Override
    protected byte[] fetchMetadata() throws ResolverException {
        // NOPE, we don't need to try and fetch the metadata
        return null;
    }
}