package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.controller.support.RestControllersSupport;
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
import java.util.Comparator;
import java.util.List;
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

    @Autowired
    RestControllersSupport restControllersSupport;

    @PostMapping
    @Transactional
    public ResponseEntity<?> updateFiltersPositionOrder(@PathVariable String metadataResolverId,
                                                        @RequestBody List<String> filtersResourceIds) {

        MetadataResolver resolver = restControllersSupport.findResolverOrThrowHttp404(metadataResolverId);
        List<MetadataFilter> currentFilters = resolver.getMetadataFilters();

        //Check for bad data upfront. We could avoid this check and take wrong size and/or filter ids and blindly pass to sort below.
        //In that case, the sort operation will silently NOT do anything and leave original filters order,
        //but we will not be able to indicate to calling clients HTTP 400 in that case.
        if ((filtersResourceIds.size() != currentFilters.size()) ||
                (!currentFilters.stream()
                        .map(MetadataFilter::getResourceId)
                        .collect(toList())
                        .containsAll(filtersResourceIds))) {

            return ResponseEntity
                    .badRequest()
                    .body("Number of filters to reorder or filters resource ids do not match current filters");
        }

        //This is needed in order to set reference to persistent filters collection to be able to merge the persistent collection
        //Otherwise if we manipulate the original collection directly and try to save, we'll get RDBMS constraint violation exception
        List<MetadataFilter> reOrderedFilters = new ArrayList<>(currentFilters);

        //Main re-ordering operation
        reOrderedFilters.sort(Comparator.comparingInt(f -> filtersResourceIds.indexOf(f.getResourceId())));

        //re-set the reference and save to DB
        resolver.setMetadataFilters(reOrderedFilters);
        metadataResolverRepository.save(resolver);

        return ResponseEntity.noContent().build();
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getFiltersPositionOrder(@PathVariable String metadataResolverId) {
        MetadataResolver resolver = restControllersSupport.findResolverOrThrowHttp404(metadataResolverId);
        List<String> resourceIds = resolver.getMetadataFilters().stream()
                .map(MetadataFilter::getResourceId)
                .collect(toList());

        return ResponseEntity.ok(resourceIds);
    }
}
