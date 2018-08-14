package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FilesystemMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.LocalDynamicMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.ResourceBackedMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFileBackedHTTPMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFilesystemMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlFunctionDrivenDynamicHTTPMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlLocalDynamicMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlResourceBackedMetadataResolver;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.resource.Resource;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.core.xml.persist.FilesystemLoadSaveManager;
import org.opensaml.core.xml.persist.XMLObjectLoadSaveManager;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Service
public class MetadataResolverConverterServiceImpl implements MetadataResolverConverterService {

    @Autowired
    IndexWriterService indexWriterService;

    @Autowired
    LuceneMetadataResolverService luceneMetadataResolverService;

    private OpenSamlFunctionDrivenDynamicHTTPMetadataResolver convertToOpenSamlRepresentation(DynamicHttpMetadataResolver resolver) throws IOException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        return new OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(indexWriter,
                                                                     luceneMetadataResolverService,
                                                                     resolver);
    }

    private OpenSamlFileBackedHTTPMetadataResolver convertToOpenSamlRepresentation(FileBackedHttpMetadataResolver resolver) throws IOException, ResolverException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        return new OpenSamlFileBackedHTTPMetadataResolver(indexWriter, luceneMetadataResolverService, resolver);
    }

    private OpenSamlFilesystemMetadataResolver convertToOpenSamlRepresentation(FilesystemMetadataResolver resolver) throws IOException, ResolverException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        File metadataFile = new File(resolver.getMetadataFile());

        return new OpenSamlFilesystemMetadataResolver(metadataFile,
                                                      indexWriter,
                                                      luceneMetadataResolverService,
                                                      resolver);
    }

    private OpenSamlLocalDynamicMetadataResolver convertToOpenSamlRepresentation(LocalDynamicMetadataResolver resolver) throws IOException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        //TODO: This is an educated guess.
        XMLObjectLoadSaveManager manager = new FilesystemLoadSaveManager(resolver.getSourceDirectory());

        return new OpenSamlLocalDynamicMetadataResolver(manager, indexWriter, luceneMetadataResolverService, resolver);
    }

    private OpenSamlResourceBackedMetadataResolver convertToOpenSamlRepresentation(ResourceBackedMetadataResolver resolver) throws IOException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        ResourceBackedMetadataResolver.ResourceType resourceType = resolver.validateAndDetermineResourceType();
        Resource resource = null;
        switch (resourceType) {
            case SVN:
                //TODO: What sort of resource type should be created here? URL?
                break;
            case CLASSPATH:
                resource = (Resource) new ClassPathResource(resolver.getClasspathMetadataResource().getFile());
                break;
            default:
                throw new RuntimeException("Unsupported resource type!");
        }

        return new OpenSamlResourceBackedMetadataResolver(resource,
                                                          indexWriter,
                                                          luceneMetadataResolverService,
                                                          resolver);
    }

    @Override
    public MetadataResolver convertToOpenSamlRepresentation(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver resolver) throws IOException, ResolverException {
        switch (resolver.getType()) {
            case "LocalDynamicMetadataResolver":
                return convertToOpenSamlRepresentation((LocalDynamicMetadataResolver) resolver);
            case "FileBackedHttpMetadataResolver":
                return convertToOpenSamlRepresentation((FileBackedHttpMetadataResolver) resolver);
            case "DynamicHttpMetadataResolver":
                return convertToOpenSamlRepresentation((DynamicHttpMetadataResolver) resolver);
            case "FilesystemMetadataResolver":
                return convertToOpenSamlRepresentation((FilesystemMetadataResolver) resolver);
            case "ResourceBackedMetadataResolver":
                return convertToOpenSamlRepresentation((ResourceBackedMetadataResolver) resolver);
            default:
                throw new RuntimeException("Unsupported metadata resolver type!");
        }
    }
}
