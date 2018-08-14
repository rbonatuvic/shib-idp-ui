package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
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
    private LuceneMetadataResolverService luceneMetadataResolverService;
    private edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver sourceResolver;

    public OpenSamlLocalDynamicMetadataResolver(@Nonnull XMLObjectLoadSaveManager<XMLObject> manager,
                                                IndexWriter indexWriter,
                                                LuceneMetadataResolverService luceneMetadataResolverService,
                                                edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver sourceResolver) {
        super(manager);
        this.indexWriter = indexWriter;
        this.luceneMetadataResolverService = luceneMetadataResolverService;
        this.sourceResolver = sourceResolver;

        OpenSamlMetadataResolverConstructorHelper.updateOpenSamlMetadataResolverFromDynamicMetadataResolverAttributes(
                this, sourceResolver.getDynamicMetadataResolverAttributes());

        //TODO: Where do these refs get used in OpenSAML land?
        // sourceResolver.getSourceKeyGeneratorRef();
        // sourceResolver.getSourceManagerRef();
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();

        luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                                            this.sourceResolver.getResourceId(),
                                                                            indexWriter);
    }
}
