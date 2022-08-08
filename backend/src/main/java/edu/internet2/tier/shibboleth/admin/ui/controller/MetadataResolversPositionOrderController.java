package edu.internet2.tier.shibboleth.admin.ui.controller;


import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.tags.Tags;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/MetadataResolversPositionOrder")
@Tags(value = {@Tag(name = "metadata resolvers")})
public class MetadataResolversPositionOrderController {

    @Autowired
    MetadataResolversPositionOrderContainerService positionOrderContainerService;

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@RequestBody MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {
        positionOrderContainerService.addOrUpdatePositionOrderContainer(metadataResolversPositionOrderContainer);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<?> getPositionOrderContainer() {
        return ResponseEntity.ok(positionOrderContainerService.retrieveExistingOrEmpty());
    }
}