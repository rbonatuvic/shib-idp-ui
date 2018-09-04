package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.FilesystemMetadataResolver;

import javax.annotation.Nullable;
import java.io.File;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFilesystemMetadataResolver extends FilesystemMetadataResolver {
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
}
