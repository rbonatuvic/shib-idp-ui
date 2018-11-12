package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.saml.metadata.resolver.impl.FunctionDrivenDynamicHTTPMetadataResolver;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlFunctionDrivenDynamicHTTPMetadataResolver extends FunctionDrivenDynamicHTTPMetadataResolver {
    private IndexWriter indexWriter;
    private DynamicHttpMetadataResolver sourceResolver;
    private OpenSamlMetadataResolverDelegate delegate;

    public OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(ParserPool parserPool,
                                                             IndexWriter indexWriter,
                                                             DynamicHttpMetadataResolver sourceResolver) {
        super(HttpClients.createMinimal());
        this.indexWriter = indexWriter;
        this.sourceResolver = sourceResolver;
        this.delegate = new OpenSamlMetadataResolverDelegate();

        this.setId(sourceResolver.getResourceId());

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(
                this, sourceResolver.getDynamicMetadataResolverAttributes(), parserPool);

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromHttpMetadataResolverAttributes(
                this, sourceResolver.getHttpMetadataResolverAttributes());

        this.setSupportedContentTypes(sourceResolver.getSupportedContentTypes());

        //TODO: These don't seem to be used anywhere.
        // In the parser, if not null, a warning is logged .. but nothing else happens with them.
        // sourceResolver.getMaxConnectionsPerRoute();
        // sourceResolver.getMaxConnectionsTotal();
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        if (sourceResolver.getDoInitialization()) {
            super.initMetadataResolver();

            delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                           this.sourceResolver.getResourceId(),
                                                           indexWriter);
        }
    }

    public void refresh() throws ComponentInitializationException {
        delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                       this.sourceResolver.getResourceId(),
                                                       indexWriter);
    }
}
