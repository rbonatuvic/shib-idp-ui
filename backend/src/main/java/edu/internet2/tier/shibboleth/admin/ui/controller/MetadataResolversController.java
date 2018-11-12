package edu.internet2.tier.shibboleth.admin.ui.controller;

import com.fasterxml.jackson.databind.exc.InvalidTypeIdException;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidationService;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml.OpenSamlChainingMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.IndexWriterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverConverterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService;
import edu.internet2.tier.shibboleth.admin.util.OpenSamlChainingMetadataResolverUtil;
import lombok.extern.slf4j.Slf4j;
import net.shibboleth.utilities.java.support.component.ComponentInitializationException;
import net.shibboleth.utilities.java.support.resolver.ResolverException;
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
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringWriter;
import java.net.URI;
import java.util.List;

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
    MetadataResolversPositionOrderContainerService positionOrderContainerService;

    @Autowired
    IndexWriterService indexWriterService;

    @Autowired
    org.opensaml.saml.metadata.resolver.MetadataResolver chainingMetadataResolver;

    @Autowired
    MetadataResolverConverterService metadataResolverConverterService;

    @ExceptionHandler({InvalidTypeIdException.class, IOException.class, HttpMessageNotReadableException.class})
    public ResponseEntity<?> unableToParseJson(Exception ex) {
        return ResponseEntity.badRequest().body(new ErrorResponse(HttpStatus.BAD_REQUEST.toString(), ex.getMessage()));
    }

    @GetMapping("/MetadataResolvers")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        List<MetadataResolver> resolvers = positionOrderContainerService.getAllMetadataResolversInDefinedOrderOrUnordered();
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
        return ResponseEntity.ok(resolver);
    }

    @PostMapping("/MetadataResolvers")
    @Transactional
    public ResponseEntity<?> create(@RequestBody MetadataResolver newResolver) throws IOException, ResolverException, ComponentInitializationException {
        if (resolverRepository.findByName(newResolver.getName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        ResponseEntity<?> validationErrorResponse = validate(newResolver);
        if(validationErrorResponse != null) {
            return validationErrorResponse;
        }

        MetadataResolver persistedResolver = resolverRepository.save(newResolver);
        positionOrderContainerService.appendPositionOrderForNew(persistedResolver);

        //TODO: currently, the update call might explode, but the save works.. in which case, the UI never gets
        // n valid response. This operation is not atomic. Should we return an error here?
        if (persistedResolver.getDoInitialization()) {
            org.opensaml.saml.metadata.resolver.MetadataResolver openSamlRepresentation = metadataResolverConverterService.convertToOpenSamlRepresentation(persistedResolver);
            OpenSamlChainingMetadataResolverUtil.updateChainingMetadataResolver((OpenSamlChainingMetadataResolver) chainingMetadataResolver, openSamlRepresentation);
        }

        return ResponseEntity.created(getResourceUriFor(persistedResolver)).body(persistedResolver);
    }

    @PutMapping("/MetadataResolvers/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable String resourceId, @RequestBody MetadataResolver updatedResolver) throws IOException, ResolverException, ComponentInitializationException {
        MetadataResolver existingResolver = resolverRepository.findByResourceId(resourceId);
        if (existingResolver == null) {
            return ResponseEntity.notFound().build();
        }
        if (existingResolver.getVersion() != updatedResolver.getVersion()) {
            log.info("Metadata Resolver version conflict. Latest resolver in database version: {}. Resolver version sent from UI: {}",
                    existingResolver.getVersion(), updatedResolver.getVersion());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        ResponseEntity<?> validationErrorResponse = validate(updatedResolver);
        if(validationErrorResponse != null) {
            return validationErrorResponse;
        }

        updatedResolver.setAudId(existingResolver.getAudId());

        MetadataResolver persistedResolver = resolverRepository.save(updatedResolver);

        if (persistedResolver.getDoInitialization()) {
            org.opensaml.saml.metadata.resolver.MetadataResolver openSamlRepresentation = null;
            try {
                openSamlRepresentation = metadataResolverConverterService.convertToOpenSamlRepresentation(persistedResolver);
            } catch (FileNotFoundException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.toString(), "label.file-doesnt-exist"));
            }
            OpenSamlChainingMetadataResolverUtil.updateChainingMetadataResolver((OpenSamlChainingMetadataResolver) chainingMetadataResolver, openSamlRepresentation);
        }

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
}
