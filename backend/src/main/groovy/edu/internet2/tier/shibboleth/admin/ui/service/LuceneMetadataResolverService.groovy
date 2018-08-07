package edu.internet2.tier.shibboleth.admin.ui.service

import net.shibboleth.utilities.java.support.component.ComponentInitializationException
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.StringField
import org.apache.lucene.document.TextField
import org.apache.lucene.index.IndexWriter
import org.opensaml.saml.metadata.resolver.impl.AbstractMetadataResolver
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Service
class LuceneMetadataResolverService {
    private static final Logger logger = LoggerFactory.getLogger(LuceneMetadataResolverService.class)

    void addIndexedDescriptorsFromBackingStore(AbstractMetadataResolver.EntityBackingStore backingStore, String resourceId, IndexWriter indexWriter) {
        for (String entityId : backingStore.getIndexedDescriptors().keySet()) {
            Document document = new Document()
            document.add(new StringField("id", entityId, Field.Store.YES))
            document.add(new TextField( "content", entityId, Field.Store.YES)) // TODO: change entityId to be content of entity descriptor block
            document.add(new StringField("tag", resourceId, Field.Store.YES))
            try {
                indexWriter.addDocument(document)
            } catch (IOException e) {
                logger.error(e.getMessage(), e)
            }
        }
        try {
            indexWriter.commit()
        } catch (IOException e) {
            throw new ComponentInitializationException(e)
        }
    }
}
