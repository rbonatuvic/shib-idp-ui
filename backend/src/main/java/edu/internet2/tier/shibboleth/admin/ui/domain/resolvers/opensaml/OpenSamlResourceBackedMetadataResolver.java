package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resource.Resource;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver;

import javax.annotation.Nullable;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlResourceBackedMetadataResolver extends ResourceBackedMetadataResolver {
    private IndexWriter indexWriter;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver;
    private OpenSamlMetadataResolverDelegate delegate;

    public OpenSamlResourceBackedMetadataResolver(ParserPool parserPool,
                                                  IndexWriter indexWriter,
                                                  edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver sourceResolver,
                                                  Resource resource) throws IOException {
        super(resource);
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
