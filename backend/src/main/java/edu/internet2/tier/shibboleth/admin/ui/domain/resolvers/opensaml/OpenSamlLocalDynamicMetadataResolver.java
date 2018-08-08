package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import com.google.common.base.Function;
import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.persist.XMLObjectLoadSaveManager;
import org.opensaml.saml.metadata.resolver.impl.LocalDynamicMetadataResolver;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.util.Timer;

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
        //TODO: set other things from the resolver here
    }

    public OpenSamlLocalDynamicMetadataResolver(@Nonnull XMLObjectLoadSaveManager<XMLObject> manager) {
        super(manager);
    }

    public OpenSamlLocalDynamicMetadataResolver(@Nonnull XMLObjectLoadSaveManager<XMLObject> manager,
                                                @Nullable Function<CriteriaSet, String> keyGenerator) {
        super(manager, keyGenerator);
    }

    public OpenSamlLocalDynamicMetadataResolver(@Nullable Timer backgroundTaskTimer,
                                                @Nonnull XMLObjectLoadSaveManager<XMLObject> manager,
                                                @Nullable Function<CriteriaSet, String> keyGenerator) {
        super(backgroundTaskTimer, manager, keyGenerator);
    }

    @Override
    protected void initMetadataResolver() throws ComponentInitializationException {
        super.initMetadataResolver();

        luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(),
                                                                            this.sourceResolver.getResourceId(),
                                                                            indexWriter);
    }

    public void setIndexWriter(IndexWriter indexWriter) {

        this.indexWriter = indexWriter;
    }

    public void setLuceneMetadataResolverService(LuceneMetadataResolverService luceneMetadataResolverService) {
        this.luceneMetadataResolverService = luceneMetadataResolverService;
    }

    public void setSourceResolver(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver sourceResolver) {
        this.sourceResolver = sourceResolver;
    }
}
