package edu.internet2.tier.shibboleth.admin.ui.configuration

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository
import net.shibboleth.ext.spring.resource.ResourceHelper
import net.shibboleth.utilities.java.support.component.ComponentInitializationException
import org.apache.lucene.document.Document
import org.apache.lucene.document.Field
import org.apache.lucene.document.StringField
import org.apache.lucene.document.TextField
import org.apache.lucene.index.IndexWriter
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver
import org.opensaml.saml.metadata.resolver.MetadataResolver
import org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ClassPathResource

@Configuration
class TestConfiguration {
    final OpenSamlObjects openSamlObjects
    final IndexWriter indexWriter
    final MetadataResolverRepository metadataResolverRepository

    TestConfiguration(final OpenSamlObjects openSamlObjects, final IndexWriter indexWriter, final MetadataResolverRepository metadataResolverRepository) {
        this.openSamlObjects =openSamlObjects
        this.indexWriter = indexWriter
        this.metadataResolverRepository = metadataResolverRepository
    }

    @Bean
    MetadataResolver metadataResolver() {
        ChainingMetadataResolver metadataResolver = new ChainingMetadataResolver()
        metadataResolver.setId("chain")

        def shortIncommon = new ResourceBackedMetadataResolver(ResourceHelper.of(new ClassPathResource('/metadata/incommon-short.xml'))){
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver()

                for (String entityId: this.getBackingStore().getIndexedDescriptors().keySet()) {
                    Document document = new Document();
                    document.add(new StringField("id", entityId, Field.Store.YES));
                    document.add(new TextField("content", entityId, Field.Store.YES)); // TODO: change entityId to be content of entity descriptor block
                    try {
                        indexWriter.addDocument(document);
                    } catch (IOException e) {
                        logger.error(e.getMessage(), e);
                    }
                }
                try {
                    indexWriter.commit()
                } catch (IOException e) {
                    throw new ComponentInitializationException(e)
                }
            }
        }.with {
            it.id = 'test'
            TestConfiguration p = owner
            it.parserPool = p.openSamlObjects.parserPool
            it.initialize()
            it
        }

        metadataResolver.resolvers = [shortIncommon]
        metadataResolver.initialize()
        return metadataResolver
    }
}