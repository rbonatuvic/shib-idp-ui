package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

/**
 * @author Dmitriy Kopylenko
 */
@RestController
@RequestMapping("/api/MetadataResolvers/{metadataResolverId}/FiltersPositionOrder")
public class MetadataFiltersPositionOrderController {

    @Autowired
    MetadataResolverRepository metadataResolverRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<?> updateFiltersPositionOrder(@PathVariable String metadataResolverId,
                                                        @RequestBody List<String> filtersResourceIds) {

        MetadataResolver resolver = metadataResolverRepository.findByResourceId(metadataResolverId);
        List<MetadataFilter> currentFilters = resolver.getMetadataFilters();
        List<MetadataFilter> reOrderedFilters = new ArrayList<>();

        filtersResourceIds.forEach(it ->
                currentFilters.stream()
                        .filter(f -> f.getResourceId().equals(it))
                        .findFirst()
                        .ifPresent(reOrderedFilters::add)
        );

        resolver.setMetadataFilters(reOrderedFilters);
        metadataResolverRepository.save(resolver);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getFiltersPositionOrder(@PathVariable String metadataResolverId) {
        MetadataResolver resolver = metadataResolverRepository.findByResourceId(metadataResolverId);
        List<String> resourceIds = resolver.getMetadataFilters().stream()
                .map(MetadataFilter::getResourceId)
                .collect(toList());

        return ResponseEntity.ok(resourceIds);
    }
}
