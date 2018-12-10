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
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import net.shibboleth.ext.spring.resource.ResourceHelper;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
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
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;

import static edu.internet2.tier.shibboleth.admin.util.TokenPlaceholderResolvers.placeholderResolverService;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class MetadataResolverConverterServiceImpl implements MetadataResolverConverterService {

    @Autowired
    IndexWriterService indexWriterService;

    @Autowired
    OpenSamlObjects openSamlObjects;

    private OpenSamlFunctionDrivenDynamicHTTPMetadataResolver convertToOpenSamlRepresentation(DynamicHttpMetadataResolver resolver) throws IOException, ComponentInitializationException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        OpenSamlFunctionDrivenDynamicHTTPMetadataResolver openSamlResolver = new OpenSamlFunctionDrivenDynamicHTTPMetadataResolver(openSamlObjects.getParserPool(),
                                                                     indexWriter,
                                                                     resolver);
        openSamlResolver.initialize();
        return openSamlResolver;
    }

    private OpenSamlFileBackedHTTPMetadataResolver convertToOpenSamlRepresentation(FileBackedHttpMetadataResolver resolver) throws IOException, ResolverException, ComponentInitializationException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        OpenSamlFileBackedHTTPMetadataResolver openSamlResolver = new OpenSamlFileBackedHTTPMetadataResolver(openSamlObjects.getParserPool(), indexWriter, resolver);
        openSamlResolver.initialize();
        return openSamlResolver;
    }

    private OpenSamlFilesystemMetadataResolver convertToOpenSamlRepresentation(FilesystemMetadataResolver resolver) throws IOException, ResolverException, ComponentInitializationException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        File metadataFile = new File(resolver.getMetadataFile());
        if (resolver.getDoInitialization() && !metadataFile.exists()) {
            throw new FileNotFoundException("No file was found on the file system for provided filename: " + resolver.getMetadataFile());
        }

        OpenSamlFilesystemMetadataResolver openSamlResolver = new OpenSamlFilesystemMetadataResolver(openSamlObjects.getParserPool(),
                                                      indexWriter,
                                                      resolver,
                                                      metadataFile);
        openSamlResolver.initialize();
        return openSamlResolver;
    }

    private OpenSamlLocalDynamicMetadataResolver convertToOpenSamlRepresentation(LocalDynamicMetadataResolver resolver) throws IOException, ComponentInitializationException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());

        XMLObjectLoadSaveManager manager = null;
        if (resolver.getDoInitialization()) {
            try {
                manager = new FilesystemLoadSaveManager(placeholderResolverService()
                        .resolveValueFromPossibleTokenPlaceholder(resolver.getSourceDirectory()));
            } catch (ConstraintViolationException e) {
                // the base directory string instance was null or empty
                //TODO: What should we do here? Currently, this causes a test to fail.
                throw new RuntimeException("An exception occurred while attempting to instantiate a FilesystemLoadSaveManger for the path: " + resolver.getSourceDirectory(), e);
            }
        }

        OpenSamlLocalDynamicMetadataResolver openSamlResolver = new OpenSamlLocalDynamicMetadataResolver(openSamlObjects.getParserPool(), indexWriter, resolver, manager);
        openSamlResolver.initialize();
        return openSamlResolver;
    }

    private OpenSamlResourceBackedMetadataResolver convertToOpenSamlRepresentation(ResourceBackedMetadataResolver resolver) throws IOException, ComponentInitializationException {
        IndexWriter indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        ResourceBackedMetadataResolver.ResourceType resourceType = resolver.validateAndDetermineResourceType();
        Resource resource = null;
        switch (resourceType) {
            case SVN:
                //TODO: What sort of resource type should be created here? URL?
                break;
            case CLASSPATH:
                resource = ResourceHelper.of(new ClassPathResource(placeholderResolverService()
                        .resolveValueFromPossibleTokenPlaceholder(resolver.getClasspathMetadataResource().getFile())));
                break;
            default:
                throw new RuntimeException("Unsupported resource type!");
        }

        OpenSamlResourceBackedMetadataResolver openSamlResolver = new OpenSamlResourceBackedMetadataResolver(openSamlObjects.getParserPool(),
                                                          indexWriter,
                                                          resolver,
                                                          resource);
        openSamlResolver.initialize();
        return openSamlResolver;
    }

    @Override
    public MetadataResolver convertToOpenSamlRepresentation(edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver resolver) throws IOException, ResolverException, ComponentInitializationException {
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
