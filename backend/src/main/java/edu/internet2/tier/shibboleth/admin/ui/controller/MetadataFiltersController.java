package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.FilterService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/MetadataResolver/{metadataResolverId}")
public class MetadataFiltersController {

    private static Logger LOGGER = LoggerFactory.getLogger(MetadataFiltersController.class);

    @Autowired
    private MetadataResolverRepository repository;

    @Autowired
    private FilterService filterService;

    @Autowired
    private MetadataResolverService metadataResolverService;

    @GetMapping("/Filters")
    @Transactional(readOnly = true)
    public Iterable<MetadataFilter> getAll(@PathVariable String metadataResolverId) {
        // TODO: implement lookup based on metadataResolverId once we have more than one
        return repository.findAll().iterator().next().getMetadataFilters();
    }

    @GetMapping("/Filters/{resourceId}")
    public ResponseEntity<?> getOne(@PathVariable String metadataResolverId, @PathVariable String resourceId) {
        // TODO: implement lookup based on metadataResolverId once we have more than one
        // TODO: should we check that we found exactly one filter (as in the update method below)? If not, error?
        return ResponseEntity.ok(repository.findAll().iterator().next().getMetadataFilters().stream()
                .filter(f -> f.getResourceId().equals(resourceId))
                .collect(Collectors.toList()).get(0));
    }

    @PostMapping("/Filters")
    public ResponseEntity<?> create(@PathVariable String metadataResolverId, @RequestBody MetadataFilter createdFilter) {
        //TODO: replace with get by metadataResolverId once we have more than one
        MetadataResolver metadataResolver = repository.findAll().iterator().next();
        metadataResolver.getMetadataFilters().add(createdFilter);

        MetadataResolver persistedMr = repository.save(metadataResolver);

        // we reload the filters here after save
        metadataResolverService.reloadFilters(persistedMr.getName());

        return ResponseEntity
                .created(getResourceUriFor(persistedMr, createdFilter.getResourceId()))
                .body(persistedMr.getMetadataFilters()
                                .stream()
                                .filter(filter -> filter.getResourceId().equals(createdFilter.getResourceId()))
                                .collect(Collectors.toList())
                                .get(0)); // "There can be only one!!!"

    }

    @PutMapping("/Filters/EntityAttributes/{resourceId}")
    public ResponseEntity<?> update(@PathVariable String metadataResolverId, @RequestBody EntityAttributesFilter updatedFilter) {
        //TODO: replace with get by metadataResolverId once we have more than one
        MetadataResolver metadataResolver = repository.findAll().iterator().next();

        List<MetadataFilter> filters =
                metadataResolver.getMetadataFilters().stream()
                .filter(f -> f.getResourceId().equals(updatedFilter.getResourceId()))
                .collect(Collectors.toList());
        if (filters.size() > 1) {
            // TODO: I don't think this should ever happen, but... if it does...
            // do something? throw exception, return error?
            LOGGER.warn("More than one filter was found for id {}! This is probably a bad thing.\n" +
                    "We're going to go ahead and use the first one, but .. look in to this!", updatedFilter.getResourceId());
        }

        EntityAttributesFilter filter = EntityAttributesFilter.class.cast(filters.get(0));
        // Verify we're the only one attempting to update the filter
        if (updatedFilter.getVersion() != filter.hashCode()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        filter.setName(updatedFilter.getName());
        filter.setFilterEnabled(updatedFilter.isFilterEnabled());
        filter.setEntityAttributesFilterTarget(updatedFilter.getEntityAttributesFilterTarget());
        filter.setRelyingPartyOverrides(updatedFilter.getRelyingPartyOverrides());
        filter.setAttributeRelease(updatedFilter.getAttributeRelease());
        filter.intoTransientRepresentation();

        MetadataResolver persistedMr = repository.save(metadataResolver);

        metadataResolverService.reloadFilters(persistedMr.getName());

        return ResponseEntity.ok()
                .body(persistedMr.getMetadataFilters().stream()
                .filter(f -> f.getResourceId().equals(updatedFilter.getResourceId()))
                .collect(Collectors.toList()).get(0));
    }

    private static URI getResourceUriFor(MetadataResolver mr, String filterResourceId) {
        return ServletUriComponentsBuilder
                .fromCurrentServletMapping().path("/api/MetadataResolver/")
                .pathSegment(mr.getResourceId())
                .pathSegment("Filters")
                .pathSegment(filterResourceId)
                .build()
                .toUri();
    }
}
