package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.core.xml.persist.FilesystemLoadSaveManager;
import org.opensaml.core.xml.persist.XMLObjectLoadSaveManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import java.io.IOException;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class LocalDynamicMetadataResolver extends MetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(LocalDynamicMetadataResolver.class);

    @Autowired
    LuceneMetadataResolverService luceneMetadataResolverService;

    public LocalDynamicMetadataResolver() {
        type = "LocalDynamicMetadataResolver";
    }

    private String sourceDirectory;

    private String sourceManagerRef;

    private String sourceKeyGeneratorRef;

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;

    public org.opensaml.saml.metadata.resolver.impl.LocalDynamicMetadataResolver createOpenSamlResolver(IndexWriter indexWriter) throws ResolverException {
        XMLObjectLoadSaveManager manager = null;
        // manager = new .. what?

        final String resourceId = this.getResourceId();

        org.opensaml.saml.metadata.resolver.impl.LocalDynamicMetadataResolver openSamlResolver = new org.opensaml.saml.metadata.resolver.impl.LocalDynamicMetadataResolver(manager) {
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver();

                luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(), resourceId, indexWriter);
            }
        };
        return openSamlResolver;
    }
}
