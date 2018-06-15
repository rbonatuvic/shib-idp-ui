package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.DynamicHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.DynamicHttpMetadataResolverRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@RestController
@RequestMapping("/api/MetadataProvider/DynamicHttp")
public class DynamicHttpMetadataProviderController {
    private static final Logger logger = LoggerFactory.getLogger(DynamicHttpMetadataProviderController.class);

    @Autowired
    DynamicHttpMetadataResolverRepository repository;

    @DeleteMapping("/{resourceId}")
    public ResponseEntity<?> deleteByResourceId(@PathVariable String resourceId) {
        if (repository.deleteByResourceId(resourceId)) {
            return ResponseEntity.accepted().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{metadataProviderName}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOneByName(@PathVariable String metadataProviderName) {
        DynamicHttpMetadataResolver resolver = repository.findByName(metadataProviderName);
        if (resolver == null) {
            return ResponseEntity.notFound().build();
        } else {
            resolver.setVersion(resolver.hashCode());
            return ResponseEntity.ok(resolver);
        }
    }

    @GetMapping("/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOneByResourceId(@PathVariable String resourceId) {
        DynamicHttpMetadataResolver resolver = repository.findByResourceId(resourceId);
        if (resolver == null) {
            return ResponseEntity.notFound().build();
        } else {
            resolver.setVersion(resolver.hashCode());
            return ResponseEntity.ok(resolver);
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DynamicHttpMetadataResolver resolver) {
        if (repository.findByName(resolver.getName()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        DynamicHttpMetadataResolver persistedResolver = repository.save(resolver);
        persistedResolver.setVersion(persistedResolver.hashCode());

        return ResponseEntity
                .created(getResourceUriFor(persistedResolver))
                .body(persistedResolver);
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody DynamicHttpMetadataResolver resolver) {
        DynamicHttpMetadataResolver existingResolver = repository.findByResourceId(resolver.getResourceId());

        if (existingResolver == null) {
            return ResponseEntity.notFound().build();
        }

        if (existingResolver.hashCode() != resolver.getVersion()) {
            logger.info("Comparing: " + existingResolver.hashCode() + " with " + resolver.getVersion());
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        resolver.setAudId(existingResolver.getAudId());
        //TODO: Do we need to set anything else? dates?

        DynamicHttpMetadataResolver updatedResolver = repository.save(resolver);
        updatedResolver.setVersion(updatedResolver.hashCode());

        return ResponseEntity.ok(updatedResolver);
    }

    private static URI getResourceUriFor(DynamicHttpMetadataResolver resolver) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/MetadataProvider/DynamicHttp/")
                .pathSegment(resolver.getResourceId())
                .build()
                .toUri();
    }

}
