package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.service.EntityIdsSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/EntityIds/search")
public class EntityIdsSearchController {

    EntityIdsSearchService entityIdsSearchService;

    public EntityIdsSearchController(EntityIdsSearchService entityIdsSearchService) {
        this.entityIdsSearchService = entityIdsSearchService;
    }

    @GetMapping
    ResponseEntity<?> search(@RequestParam String resourceId,
                             @RequestParam String term,
                             @RequestParam(required = false) Integer limit) {
        //Zero indicates no-limit
        final int resultLimit = (limit != null ? limit : 10);
        return ResponseEntity.ok(this.entityIdsSearchService.findBySearchTermAndOptionalLimit(resourceId, term, resultLimit));
    }
}
