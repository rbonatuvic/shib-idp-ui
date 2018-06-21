package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MetadataResolversController {

    @GetMapping("/MetadataResolvers")
    ResponseEntity<?> getAll() {
        //TODO implement
        return ResponseEntity.ok().build();
    }

    @GetMapping("/MetadataResolvers/{resourceId}")
    ResponseEntity<?> getOne(@PathVariable String resourceId) {
        //TODO implement
        return ResponseEntity.ok().build();
    }

    @PostMapping("/MetadataResolvers")
    ResponseEntity<?> create(@RequestBody MetadataResolver newResolver) {
        //TODO implement
        return ResponseEntity.ok().build();
    }

    @PutMapping("/MetadataResolvers/{resourceId}")
    ResponseEntity<?> update(@PathVariable String resourceId, @RequestBody MetadataResolver updatedResolver) {
        //TODO implement
        return ResponseEntity.ok().build();
    }
}
