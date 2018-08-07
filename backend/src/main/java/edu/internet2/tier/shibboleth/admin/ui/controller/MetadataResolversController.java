package edu.internet2.tier.shibboleth.admin.ui.controller;

import com.fasterxml.jackson.databind.exc.InvalidTypeIdException;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidationService;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import lombok.extern.slf4j.Slf4j;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.IndexWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;

import static edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator.ValidationResult;

@RestController
@RequestMapping("/api")
@Slf4j
public class MetadataResolversController {

    @Autowired
    MetadataResolverRepository resolverRepository;

    @Autowired
    MetadataResolverValidationService metadataResolverValidationService;

    @Autowired
    MetadataResolverService metadataResolverService;

    @Autowired
    IndexWriterService indexWriterService;

    @ExceptionHandler({InvalidTypeIdException.class, IOException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<?> unableToParseJson(Exception ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST.toString(), ex.getMessage()));
    }

    @GetMapping("/MetadataResolvers")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        Iterable<MetadataResolver> resolvers = resolverRepository.findAll();
        resolvers.forEach(MetadataResolver::updateVersion);
        return ResponseEntity.ok(resolvers);
    }

    @GetMapping(value = "/MetadataResolvers", produces = "application/xml")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getXml() throws IOException, TransformerException {
        // TODO: externalize
        try (StringWriter writer = new StringWriter()) {
            Transformer transformer = TransformerFactory.newInstance().newTransformer();
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "2");

            transformer.transform(new DOMSource(metadataResolverService.generateConfiguration()), new StreamResult(writer));
            return ResponseEntity.ok(writer.toString());
        }
    }

    @GetMapping("/MetadataResolvers/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String resourceId) {
        MetadataResolver resolver = resolverRepository.findByResourceId(resourceId);
        if (resolver == null) {
            return ResponseEntity.notFound().build();
        }
        resolver.updateVersion();
        return ResponseEntity.ok(resolver);
    }

    @PostMapping("/MetadataResolvers")
    @Transactional
    public ResponseEntity<?> create(@RequestBody MetadataResolver newResolver) {
        if (resolverRepository.findByName(newResolver.getName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        ResponseEntity<?> validationErrorResponse = validate(newResolver);
        if(validationErrorResponse != null) {
            return validationErrorResponse;
        }

        newResolver.convertFiltersFromTransientRepresentationIfNecessary();
        MetadataResolver persistedResolver = resolverRepository.save(newResolver);
        persistedResolver.updateVersion();

        persistedResolver.convertFiltersIntoTransientRepresentationIfNecessary();
        return ResponseEntity.created(getResourceUriFor(persistedResolver)).body(persistedResolver);
    }

    @PutMapping("/MetadataResolvers/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable String resourceId, @RequestBody MetadataResolver updatedResolver) {
        MetadataResolver existingResolver = resolverRepository.findByResourceId(resourceId);
        if (existingResolver == null) {
            return ResponseEntity.notFound().build();
        }
        if (existingResolver.hashCode() != updatedResolver.getVersion()) {
            log.info("Metadata Resolver version conflict. Latest resolver in database version: {}. Resolver version sent from UI: {}",
                    existingResolver.hashCode(), updatedResolver.getVersion());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        ResponseEntity<?> validationErrorResponse = validate(updatedResolver);
        if(validationErrorResponse != null) {
            return validationErrorResponse;
        }

        updatedResolver.setAudId(existingResolver.getAudId());

        //If one needs to update filters, it should be dealt with via filters endpoints
        updatedResolver.setMetadataFilters(existingResolver.getMetadataFilters());

        MetadataResolver persistedResolver = resolverRepository.save(updatedResolver);
        persistedResolver.updateVersion();

        return ResponseEntity.ok(persistedResolver);
    }

    @SuppressWarnings("Unchecked")
    private ResponseEntity<?> validate(MetadataResolver metadataResolver) {
        ValidationResult validationResult = metadataResolverValidationService.validateIfNecessary(metadataResolver);
        if(!validationResult.isValid()) {
            return ResponseEntity.badRequest().body(validationResult.getErrorMessage());
        }
        return null;
    }

    private static URI getResourceUriFor(MetadataResolver resolver) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/MetadataResolvers/")
                .pathSegment(resolver.getResourceId())
                .build()
                .toUri();
    }

    private void updateLucene(MetadataResolver resolver) throws ComponentInitializationException {
        IndexWriter indexWriter = null;
        try {
            indexWriter = indexWriterService.getIndexWriter(resolver.getResourceId());
        } catch (IOException e) {
            throw new ComponentInitializationException(e);
        }

        // add documents to indexWriter .. for each what?
        /*
        for () {
            Document document = new Document();
            document.add(new StringField("id", entityId, Field.Store.YES));
            document.add(new TextField("content", entityId, Field.Store.YES)); // TODO: change entityId to be content of entity descriptor block
            try {
                indexWriter.addDocument(document);
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
        }
        */

        // if document exists
        // indexWriter.updateDocument(term, document) <-- what's the term?
        // else, create...
        Document document = new Document();
        document.add(new StringField("id", resolver.getResourceId(), Field.Store.YES));

        try {
            indexWriter.addDocument(document);
        } catch (IOException e) {
            throw new ComponentInitializationException(e);
        }

        try {
            indexWriter.commit();
        } catch (IOException e) {
            throw new ComponentInitializationException(e);
        }
    }
}
