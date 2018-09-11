package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;

import javax.annotation.Nullable;

import static edu.internet2.tier.shibboleth.admin.util.DurationUtility.toMillis;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFileBackedHTTPMetadataResolver extends FileBackedHTTPMetadataResolver {
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

        this.setBackupFile(sourceResolver.getBackingFile());
        this.setBackupFileInitNextRefreshDelay(toMillis(sourceResolver.getBackupFileInitNextRefreshDelay()));
        this.setInitializeFromBackupFile(sourceResolver.getInitializeFromBackupFile());

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
}