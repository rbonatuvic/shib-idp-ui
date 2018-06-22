package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter;
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
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/MetadataResolver/{metadataResolverId}")
public class MetadataFiltersController {

    private static Logger LOGGER = LoggerFactory.getLogger(MetadataFiltersController.class);

    @Autowired
    private MetadataResolverRepository repository;

    @Autowired
    private MetadataResolverService metadataResolverService;

    @GetMapping("/Filters")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll(@PathVariable String metadataResolverId) {
        MetadataResolver resolver = repository.findByResourceId(metadataResolverId);
        if(resolver == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resolver.getMetadataFilters());
    }

    @GetMapping("/Filters/{resourceId}")
    public ResponseEntity<?> getOne(@PathVariable String metadataResolverId, @PathVariable String resourceId) {
        MetadataResolver resolver = repository.findByResourceId(metadataResolverId);
        if(resolver == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(resolver.getMetadataFilters().stream()
                .filter(f -> f.getResourceId().equals(resourceId))
                .collect(Collectors.toList()).get(0));
    }

    @PostMapping("/Filters")
    public ResponseEntity<?> create(@PathVariable String metadataResolverId, @RequestBody MetadataFilter createdFilter) {
        MetadataResolver metadataResolver = repository.findByResourceId(metadataResolverId);
        if(metadataResolver == null) {
            return ResponseEntity.notFound().build();
        }
        metadataResolver.getMetadataFilters().add(createdFilter);

        //convert before saving into database
        if(createdFilter instanceof EntityAttributesFilter) {
            EntityAttributesFilter.class.cast(createdFilter).fromTransientRepresentation();
        }
        MetadataResolver persistedMr = repository.save(metadataResolver);

        // we reload the filters here after save
        metadataResolverService.reloadFilters(persistedMr.getName());

        MetadataFilter persistedFilter =
                convertIntoTransientRepresentationIfNecessary(persistedMr.getMetadataFilters().stream(), createdFilter.getResourceId());

        return ResponseEntity
                .created(getResourceUriFor(persistedMr, createdFilter.getResourceId()))
                .body(persistedFilter);

    }

    @PutMapping("/Filters/{resourceId}")
    public ResponseEntity<?> update(@PathVariable String metadataResolverId,
                                    @PathVariable String resourceId,
                                    @RequestBody MetadataFilter updatedFilter) {

        MetadataResolver metadataResolver = repository.findByResourceId(metadataResolverId);
        if(metadataResolver == null) {
            return ResponseEntity.notFound().build();
        }

        if (!resourceId.equals(updatedFilter.getResourceId())) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

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

        MetadataFilter filterTobeUpdated = filters.get(0);
        // Verify we're the only one attempting to update the filter
        if (updatedFilter.getVersion() != filterTobeUpdated.hashCode()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        filterTobeUpdated.setName(updatedFilter.getName());
        filterTobeUpdated.setFilterEnabled(updatedFilter.isFilterEnabled());
        updateConcreteFilterTypeData(filterTobeUpdated, updatedFilter);

        //convert before saving into database
        if(filterTobeUpdated instanceof EntityAttributesFilter) {
            EntityAttributesFilter.class.cast(filterTobeUpdated).fromTransientRepresentation();
        }

        MetadataResolver persistedMr = repository.save(metadataResolver);

        metadataResolverService.reloadFilters(persistedMr.getName());

        MetadataFilter persistedFilter =
                convertIntoTransientRepresentationIfNecessary(persistedMr.getMetadataFilters().stream(), updatedFilter.getResourceId());

        return ResponseEntity.ok().body(persistedFilter);
    }

    private MetadataFilter convertIntoTransientRepresentationIfNecessary(Stream<MetadataFilter> filters, final String filterResourceId) {
        MetadataFilter persistedFilter = filters
                .filter(f -> f.getResourceId().equals(filterResourceId))
                .collect(Collectors.toList()).get(0);

        //convert before saving into database
        if(persistedFilter instanceof EntityAttributesFilter) {
            EntityAttributesFilter.class.cast(persistedFilter).intoTransientRepresentation();
        }
        return persistedFilter;
    }

    /**
     *
     * Add else if instanceof block here for each concrete filter types we add in the future
     */
    private void updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated, MetadataFilter filterWithUpdatedData) {
        if(filterWithUpdatedData instanceof EntityAttributesFilter) {
            EntityAttributesFilter toFilter = EntityAttributesFilter.class.cast(filterToBeUpdated);
            EntityAttributesFilter fromFilter = EntityAttributesFilter.class.cast(filterWithUpdatedData);
            toFilter.setEntityAttributesFilterTarget(fromFilter.getEntityAttributesFilterTarget());
            toFilter.setRelyingPartyOverrides(fromFilter.getRelyingPartyOverrides());
            toFilter.setAttributeRelease(fromFilter.getAttributeRelease());
        }
        else if(filterWithUpdatedData instanceof EntityRoleWhiteListFilter) {
            EntityRoleWhiteListFilter toFilter = EntityRoleWhiteListFilter.class.cast(filterToBeUpdated);
            EntityRoleWhiteListFilter fromFilter = EntityRoleWhiteListFilter.class.cast(filterWithUpdatedData);
            toFilter.setRemoveEmptyEntitiesDescriptors(fromFilter.getRemoveEmptyEntitiesDescriptors());
            toFilter.setRemoveRolelessEntityDescriptors(fromFilter.getRemoveRolelessEntityDescriptors());
            toFilter.setRetainedRoles(fromFilter.getRetainedRoles());
        }
        else if(filterWithUpdatedData instanceof RequiredValidUntilFilter) {
            RequiredValidUntilFilter toFilter = RequiredValidUntilFilter.class.cast(filterToBeUpdated);
            RequiredValidUntilFilter fromFilter = RequiredValidUntilFilter.class.cast(filterWithUpdatedData);
            toFilter.setMaxValidityInterval(fromFilter.getMaxValidityInterval());
        }
        //TODO: add other types of concrete filters update here
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
