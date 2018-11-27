package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataRequestURLConstructionScheme;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.RegexScheme;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.TemplateScheme;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.index.IndexWriter;
import org.apache.velocity.app.VelocityEngine;
import org.opensaml.saml.metadata.resolver.impl.FunctionDrivenDynamicHTTPMetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.MetadataQueryProtocolRequestURLBuilder;
import org.opensaml.saml.metadata.resolver.impl.RegexRequestURLBuilder;
import org.opensaml.saml.metadata.resolver.impl.TemplateRequestURLBuilder;

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

        switch (MetadataRequestURLConstructionScheme.SchemeType.get(sourceResolver.getMetadataRequestURLConstructionScheme().getType())) {
            case METADATA_QUERY_PROTOCOL:
                this.setRequestURLBuilder(new MetadataQueryProtocolRequestURLBuilder(sourceResolver.getMetadataRequestURLConstructionScheme().getContent()));
                break;
            case TEMPLATE:
                TemplateScheme templateScheme = (TemplateScheme) sourceResolver.getMetadataRequestURLConstructionScheme();
                this.setRequestURLBuilder(new TemplateRequestURLBuilder(
                        new VelocityEngine(), // we may want to do something with this here: templateScheme.getVelocityEngine()
                        templateScheme.getContent(),
                        TemplateRequestURLBuilder.EncodingStyle.valueOf(templateScheme.getEncodingStyle().toString().toLowerCase()),
                        null)); // this may need to be an actual Function, but all we have is a ref
                break;
            case REGEX:
                RegexScheme regexScheme = (RegexScheme) sourceResolver.getMetadataRequestURLConstructionScheme();
                this.setRequestURLBuilder(new RegexRequestURLBuilder(regexScheme.getMatch(), regexScheme.getContent()));
                break;
            default:
                break;
        }
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
