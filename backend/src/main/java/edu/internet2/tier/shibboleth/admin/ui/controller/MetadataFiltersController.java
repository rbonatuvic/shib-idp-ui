package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityRoleWhiteListFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.RequiredValidUntilFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.SignatureValidationFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/MetadataResolvers/{metadataResolverId}")
public class MetadataFiltersController {

    @Autowired
    private MetadataResolverRepository repository;

    @Autowired
    private MetadataResolverService metadataResolverService;

    @Autowired
    private FilterRepository filterRepository;

    private static final Supplier<HttpClientErrorException> HTTP_404_CLIENT_ERROR_EXCEPTION = () -> new HttpClientErrorException(NOT_FOUND);

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
        MetadataResolver persistedMr = repository.save(metadataResolver);

        // we reload the filters here after save
        metadataResolverService.reloadFilters(persistedMr.getName());

        MetadataFilter persistedFilter = newlyPersistedFilter(persistedMr.getMetadataFilters().stream(), createdFilter.getResourceId());

        return ResponseEntity
                .created(getResourceUriFor(persistedMr, createdFilter.getResourceId()))
                .body(persistedFilter);

    }

    @PutMapping("/Filters/{resourceId}")
    public ResponseEntity<?> update(@PathVariable String metadataResolverId,
                                    @PathVariable String resourceId,
                                    @RequestBody MetadataFilter updatedFilter) {
        MetadataFilter filterTobeUpdated = filterRepository.findByResourceId(resourceId);
        if (filterTobeUpdated == null) {
            return ResponseEntity.notFound().build();
        }

        MetadataResolver metadataResolver = repository.findByResourceId(metadataResolverId);
        if(metadataResolver == null) {
            return ResponseEntity.notFound().build();
        }

        // check to make sure that the relationship exists
        if (!metadataResolver.getMetadataFilters().contains(filterTobeUpdated)) {
            // TODO: find a better response
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        if (!resourceId.equals(updatedFilter.getResourceId())) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        // Verify we're the only one attempting to update the filter
        if (updatedFilter.getVersion() != filterTobeUpdated.getVersion()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        filterTobeUpdated.setName(updatedFilter.getName());
        filterTobeUpdated.setFilterEnabled(updatedFilter.isFilterEnabled());
        updateConcreteFilterTypeData(filterTobeUpdated, updatedFilter);

        MetadataFilter persistedFilter = filterRepository.save(filterTobeUpdated);

        // TODO: this is wrong
        metadataResolverService.reloadFilters(metadataResolver.getName());

        return ResponseEntity.ok().body(persistedFilter);
    }

    @DeleteMapping("/Filters/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String metadataResolverId,
                                    @PathVariable String resourceId) {

        MetadataResolver resolver = findResolverOrThrowHttp404(metadataResolverId);
        boolean removed = resolver.getMetadataFilters().removeIf(f -> f.getResourceId().equals(resourceId));
        if(!removed) {
            throw HTTP_404_CLIENT_ERROR_EXCEPTION.get();
        }
        repository.save(resolver);

        //TODO: do we need to reload filters here?!?
        //metadataResolverService.reloadFilters(persistedMr.getName());

        return ResponseEntity.noContent().build();
    }

    private MetadataResolver findResolverOrThrowHttp404(String resolverResourceId) {
        MetadataResolver resolver = repository.findByResourceId(resolverResourceId);
        if(resolver == null) {
            throw HTTP_404_CLIENT_ERROR_EXCEPTION.get();
        }
        return resolver;
    }

    private MetadataFilter newlyPersistedFilter(Stream<MetadataFilter> filters, final String filterResourceId) {
        MetadataFilter persistedFilter = filters
                .filter(f -> f.getResourceId().equals(filterResourceId))
                .collect(Collectors.toList()).get(0);

        return persistedFilter;
    }

    /**
     *
     * Add else if instanceof block here for each concrete filter types we add in the future
     */
    private void updateConcreteFilterTypeData(MetadataFilter filterToBeUpdated, MetadataFilter filterWithUpdatedData) {
        //TODO: Could we maybe use Dozer here before things get out of control? https://dozermapper.github.io
        // Mapper mapper = new net.sf.dozer.Mapper(); // or autowire one
        // mapper.map(fromFilter, toFilter);
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
        else if (filterWithUpdatedData instanceof SignatureValidationFilter) {
            SignatureValidationFilter toFilter = SignatureValidationFilter.class.cast(filterToBeUpdated);
            SignatureValidationFilter fromFilter = SignatureValidationFilter.class.cast(filterWithUpdatedData);
            toFilter.setRequireSignedRoot(fromFilter.getRequireSignedRoot());
            toFilter.setCertificateFile(fromFilter.getCertificateFile());
            toFilter.setDefaultCriteriaRef(fromFilter.getDefaultCriteriaRef());
            toFilter.setSignaturePrevalidatorRef(fromFilter.getSignaturePrevalidatorRef());
            toFilter.setDynamicTrustedNamesStrategyRef(fromFilter.getDynamicTrustedNamesStrategyRef());
            toFilter.setTrustEngineRef(fromFilter.getTrustEngineRef());
            toFilter.setPublicKey(fromFilter.getPublicKey());
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
                .fromCurrentServletMapping().path("/api/MetadataResolvers/")
                .pathSegment(mr.getResourceId())
                .pathSegment("Filters")
                .pathSegment(filterResourceId)
                .build()
                .toUri();
    }
}