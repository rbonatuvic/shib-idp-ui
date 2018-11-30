package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.CriteriaSet;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.saml.metadata.resolver.impl.AbstractMetadataResolver;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class OpenSamlMetadataResolverDelegate extends AbstractMetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(OpenSamlMetadataResolverDelegate.class);

    @Nonnull
    @Override
    public Iterable<EntityDescriptor> resolve(@Nullable CriteriaSet criteria) {
        throw new UnsupportedOperationException("This method should not be called.");
    }

    void addIndexedDescriptorsFromBackingStore(AbstractMetadataResolver.EntityBackingStore backingStore, String resourceId, IndexWriter indexWriter) throws ComponentInitializationException {
        try {
            indexWriter.deleteAll();
            for (String entityId : backingStore.getIndexedDescriptors().keySet()) {
                Document document = new Document();
                document.add(new StringField("id", entityId, Field.Store.YES));
                document.add(new TextField("content", entityId, Field.Store.YES)); // TODO: change entityId to be content of entity descriptor block
                document.add(new StringField("tag", resourceId, Field.Store.YES));
                indexWriter.addDocument(document);
            }
            indexWriter.commit();
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
            throw new ComponentInitializationException(e);
        }
    }
}
