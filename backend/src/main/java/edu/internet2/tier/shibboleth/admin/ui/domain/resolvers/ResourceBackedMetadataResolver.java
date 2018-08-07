package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.service.LuceneMetadataResolverService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.resource.Resource;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.IndexWriter;
import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.Nullable;
import javax.persistence.Embedded;
import javax.persistence.Entity;

import java.io.IOException;

import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.CLASSPATH;
import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver.ResourceType.SVN;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class ResourceBackedMetadataResolver extends MetadataResolver {
    private static final Logger logger = LoggerFactory.getLogger(ResourceBackedMetadataResolver.class);

    public ResourceBackedMetadataResolver() {
        type = "ResourceBackedMetadataResolver";
    }

    @Autowired
    private LuceneMetadataResolverService luceneMetadataResolverService;

    @Embedded
    private ReloadableMetadataResolverAttributes reloadableMetadataResolverAttributes;

    @Embedded
    private ClasspathMetadataResource classpathMetadataResource;

    @Embedded
    private SvnMetadataResource svnMetadataResource;

    public ResourceType validateAndDetermineResourceType() throws InvalidResourceTypeException {
        if (classpathMetadataResource == null && svnMetadataResource == null) {
            throw new InvalidResourceTypeException("No metadata resource is provided. Exactly one is required");
        }
        if (classpathMetadataResource != null && svnMetadataResource != null) {
            throw new InvalidResourceTypeException("Too many metadata resources are provided. Exactly one is required");
        }
        return classpathMetadataResource != null ? CLASSPATH : SVN;
    }

    public class InvalidResourceTypeException extends IllegalStateException {
        public InvalidResourceTypeException(String s) {
            super(s);
        }
    }

    public enum ResourceType {
        CLASSPATH,
        SVN
    }

    public org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver createOpenSamlResolver(IndexWriter indexWriter) throws ResolverException, IOException {
        ResourceType resourceType = this.validateAndDetermineResourceType();
        Resource resource = null;
        switch (resourceType) {
            case SVN:
                // resource = new ... what?
                break;
            case CLASSPATH:
                resource = (Resource) new ClassPathResource(this.classpathMetadataResource.getFile());
                break;
        }
        final String resourceId = this.getResourceId();

        org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver openSamlResolver = new org.opensaml.saml.metadata.resolver.impl.ResourceBackedMetadataResolver(resource) {
            @Override
            protected void initMetadataResolver() throws ComponentInitializationException {
                super.initMetadataResolver();

                luceneMetadataResolverService.addIndexedDescriptorsFromBackingStore(this.getBackingStore(), resourceId, indexWriter);
            }

            // TODO: this is still probably not the best way to do this?
            @Nullable
            @Override
            public DateTime getLastRefresh() {
                return null;
            }
        };
        return openSamlResolver;
    }
}
