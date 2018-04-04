package edu.internet2.tier.shibboleth.admin.ui.configuration;

import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.saml.metadata.resolver.ChainingMetadataResolver;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.FileBackedHTTPMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

/**
 * this is a temporary class until a better way of doing this is found.
 */
@Configuration
public class MetadataResolverConfiguration {
    private static final Logger logger = LoggerFactory.getLogger(MetadataResolverConfiguration.class);

    @Autowired
    OpenSamlObjects openSamlObjects;

    @Autowired
    IndexWriter indexWriter;

    @Bean
    public MetadataResolver metadataResolver() throws ResolverException, ComponentInitializationException {
        MetadataResolver metadataResolver = new ChainingMetadataResolver();

        FileBackedHTTPMetadataResolver incommonMR = new FileBackedHTTPMetadataResolver(HttpClients.createMinimal(), "http://md.incommon.org/InCommon/InCommon-metadata.xml", "/tmp/incommon.xml"){
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver();

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
                    indexWriter.commit();
                } catch (IOException e) {
                    throw new ComponentInitializationException(e);
                }
            }
        };
        incommonMR.setId("incommonmd");
        incommonMR.setParserPool(openSamlObjects.getParserPool());
        incommonMR.initialize();

        return metadataResolver;
    }
}
