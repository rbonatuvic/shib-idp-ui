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
import net.shibboleth.ext.spring.resource.ResourceHelper;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
import net.shibboleth.utilities.java.support.resource.Resource;
import org.apache.lucene.index.IndexWriter;
import org.opensaml.core.xml.persist.FilesystemLoadSaveManager;
import org.opensaml.core.xml.persist.XMLObjectLoadSaveManager;
import org.opensaml.saml.metadata.resolver.MetadataResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolationException;
import java.io.File;
import java.io.IOException;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Service
public class MetadataResolverConverterServiceImpl implements MetadataResolverConverterService {

    @Autowired
    IndexWriterService indexWriterService;

    private OpenSamlFunctionDrivenDynamicHTTPMetadataResolver convertToOpenSamlRepresentation(DynamicHttpMetadataResolver resolver) throws IOException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        return new OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(indexWriter,
                                                                     resolver);
    }

    private OpenSamlFileBackedHTTPMetadataResolver convertToOpenSamlRepresentation(FileBackedHttpMetadataResolver resolver) throws IOException, ResolverException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        return new OpenSamlFileBackedHTTPMetadataResolver(indexWriter, resolver);
    }

    private OpenSamlFilesystemMetadataResolver convertToOpenSamlRepresentation(FilesystemMetadataResolver resolver) throws IOException, ResolverException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        File metadataFile = new File(resolver.getMetadataFile());

        return new OpenSamlFilesystemMetadataResolver(metadataFile,
                                                      indexWriter,
                                                      resolver);
    }

    private OpenSamlLocalDynamicMetadataResolver convertToOpenSamlRepresentation(LocalDynamicMetadataResolver resolver) throws IOException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        XMLObjectLoadSaveManager manager = null;
        try {
            manager = new FilesystemLoadSaveManager(resolver.getSourceDirectory());
        } catch (ConstraintViolationException e) {
            // the base directory string instance was null or empty
            //TODO: What should we do here? Currently, this causes a test to fail.
        }

        return new OpenSamlLocalDynamicMetadataResolver(manager, indexWriter, resolver);
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
                resource = ResourceHelper.of(new ClassPathResource(resolver.getClasspathMetadataResource().getFile()));
                break;
            default:
                throw new RuntimeException("Unsupported resource type!");
        }

        return new OpenSamlResourceBackedMetadataResolver(resource,
                                                          indexWriter,
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
