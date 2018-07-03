package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidationService;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolverValidator;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

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

    @GetMapping("/MetadataResolvers")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll() {
        Iterable<MetadataResolver> resolvers = resolverRepository.findAll();
        resolvers.forEach(MetadataResolver::updateVersion);
        return ResponseEntity.ok(resolvers);
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
        //TODO: we are disregarding attached filters if any sent from UI.
        //Only deal with filters via filters endpoints?
        newResolver.clearAllFilters();

        ResponseEntity<?> validationErrorResponse = validate(newResolver);
        if(validationErrorResponse != null) {
            return validationErrorResponse;
        }

        MetadataResolver persistedResolver = resolverRepository.save(newResolver);
        persistedResolver.updateVersion();

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

        //TODO: we are disregarding attached filters if any sent from UI.
        //Only deal with filters via filters endpoints?
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
}
