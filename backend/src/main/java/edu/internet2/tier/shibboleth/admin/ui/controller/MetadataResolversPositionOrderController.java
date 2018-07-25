package edu.internet2.tier.shibboleth.admin.ui.controller;


import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/MetadataResolversPositionOrder")
public class MetadataResolversPositionOrderController {

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@RequestBody MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {
        return ResponseEntity.ok().build();
    }
}
