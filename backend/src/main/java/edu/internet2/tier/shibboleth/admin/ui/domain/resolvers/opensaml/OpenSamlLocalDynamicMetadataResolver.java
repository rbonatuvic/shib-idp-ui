package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.xml.ParserPool;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.persist.XMLObjectLoadSaveManager;
import org.opensaml.saml.metadata.resolver.impl.LocalDynamicMetadataResolver;

import javax.annotation.Nonnull;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlLocalDynamicMetadataResolver extends LocalDynamicMetadataResolver {
    private IndexWriter indexWriter;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver sourceResolver;
    private OpenSamlMetadataResolverDelegate delegate;

    public OpenSamlLocalDynamicMetadataResolver(ParserPool parserPool,
                                                IndexWriter indexWriter,
                                                edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver sourceResolver,
                                                @Nonnull XMLObjectLoadSaveManager<XMLObject> manager) {
        super(manager);
        this.indexWriter = indexWriter;
        this.sourceResolver = sourceResolver;
        this.delegate = new OpenSamlMetadataResolverDelegate();

        this.setId(sourceResolver.getResourceId());

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(
                this, sourceResolver.getDynamicMetadataResolverAttributes(), parserPool);

        //TODO: Where do these refs get used in OpenSAML land?
        // sourceResolver.getSourceKeyGeneratorRef();
        // sourceResolver.getSourceManagerRef();
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();

        delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                       this.sourceResolver.getResourceId(),
                                                       indexWriter);
    }

    public void refresh() throws ComponentInitializationException {
        delegate.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                       this.sourceResolver.getResourceId(),
                                                       indexWriter);
    }
}
