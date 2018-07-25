package edu.internet2.tier.shibboleth.admin.ui.controller;


import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolversPositionOrderContainerService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    MetadataResolversPositionOrderContainerService positionOrderContainerService;

    @PostMapping
    public ResponseEntity<?> createOrUpdate(@RequestBody MetadataResolversPositionOrderContainer metadataResolversPositionOrderContainer) {
        this.positionOrderContainerService.addOrUpdatePositionOrderContainer(metadataResolversPositionOrderContainer);
        return ResponseEntity.noContent().build();
    }
}
