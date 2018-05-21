package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.FileBackedHttpMetadataResolverRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/MetadataProvider/FileBackedHttp")
public class FileBackedHttpMetadataProviderController {

    @Autowired
    FileBackedHttpMetadataResolverRepository repository;

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
        return ResponseEntity.ok(repository.findByName(metadataProviderName));
    }

    @GetMapping("/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOneByResourceId(@PathVariable String resourceId) {
        return ResponseEntity.ok(repository.findByResourceId(resourceId));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody FileBackedHttpMetadataResolver resolver) {
        //TODO: Check for duplicates based on name
        FileBackedHttpMetadataResolver persistedResolver = repository.save(resolver);

        return ResponseEntity
                .created(getResourceUriFor(persistedResolver))
                .body(persistedResolver);

    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody FileBackedHttpMetadataResolver resolver) {
        FileBackedHttpMetadataResolver existingResolver = repository.findByResourceId(resolver.getResourceId());
        //TODO: Handle not found.
        //TODO: Handle contention.

        resolver.setAudId(existingResolver.getAudId());

        FileBackedHttpMetadataResolver updatedResolver = repository.save(resolver);

        return ResponseEntity.ok(updatedResolver);
    }

    private static URI getResourceUriFor(FileBackedHttpMetadataResolver resolver) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/MetadataProvider/FileBackedHttp/")
                .pathSegment(resolver.getResourceId())
                .build()
                .toUri();
    }
}
