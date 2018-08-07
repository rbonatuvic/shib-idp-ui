package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import org.apache.http.HttpResponse;
import org.apache.http.impl.client.HttpClients;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.opensaml.saml.metadata.resolver.DynamicMetadataResolver;
import org.opensaml.saml.metadata.resolver.impl.FunctionDrivenDynamicHTTPMetadataResolver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.annotation.Nullable;
import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.OrderColumn;
import java.io.IOException;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class DynamicHttpMetadataResolver extends MetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(DynamicHttpMetadataResolver.class);

    @Autowired
    LuceneMetadataResolverService luceneMetadataResolverService;

    public static final String DEFAULT_TIMEOUT = "PT5S";

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;

    @Embedded
    private HttpMetadataResolverAttributes httpMetadataResolverAttributes;

    private Integer maxConnectionsTotal = 100;

    private Integer maxConnectionsPerRoute = 100;

    @ElementCollection
    @OrderColumn
    private List<String> supportedContentTypes;

    public DynamicHttpMetadataResolver() {
        type = "DynamicHttpMetadataResolver";
        this.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes();
        this.httpMetadataResolverAttributes.setConnectionRequestTimeout(DEFAULT_TIMEOUT);
        this.httpMetadataResolverAttributes.setConnectionTimeout(DEFAULT_TIMEOUT);
        this.httpMetadataResolverAttributes.setSocketTimeout(DEFAULT_TIMEOUT);
        this.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes();
    }

    public FunctionDrivenDynamicHTTPMetadataResolver createOpenSamlResolver(IndexWriter indexWriter) throws ResolverException {
        final String resourceId = this.getResourceId();

        FunctionDrivenDynamicHTTPMetadataResolver openSamlResolver = new FunctionDrivenDynamicHTTPMetadataResolver(HttpClients.createMinimal()) {
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver();

                luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(), resourceId, indexWriter);
            }
        };
        return openSamlResolver;
    }
}
