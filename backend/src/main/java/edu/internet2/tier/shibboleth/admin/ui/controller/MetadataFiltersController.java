package edu.internet2.tier.shibboleth.admin.ui.controller;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.ui.service.MetadataResolverService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.script.ScriptException;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/api/MetadataResolvers/{metadataResolverId}")
public class MetadataFiltersController {
    private static final Supplier<HttpClientErrorException> HTTP_400_BAD_REQUEST_EXCEPTION = () -> new HttpClientErrorException(BAD_REQUEST);
    private static final Supplier<HttpClientErrorException> HTTP_404_CLIENT_ERROR_EXCEPTION = () -> new HttpClientErrorException(NOT_FOUND);

    @Autowired
    org.opensaml.saml.metadata.resolver.MetadataResolver chainingMetadataResolver;

    @Autowired
    private FilterRepository filterRepository;

    @Autowired
    private IGroupService groupService;

    @Autowired
    private MetadataResolverService metadataResolverService;

    @Autowired
    private MetadataResolverRepository repository;

    @Autowired
    private UserService userService;

    @PostMapping("/Filters")
    @Transactional
    public ResponseEntity<?> create(@PathVariable String metadataResolverId, @RequestBody MetadataFilter createdFilter) {
        MetadataResolver metadataResolver = findResolverOrThrowHttp404(metadataResolverId);
        validateFilterOrThrowHttp400(createdFilter);

        metadataResolver.addFilter(createdFilter);
        MetadataResolver persistedMr = repository.save(metadataResolver);

        // we reload the filters here after save
        reloadFiltersAndHandleScriptException(persistedMr.getResourceId());

        MetadataFilter persistedFilter = newlyPersistedFilter(persistedMr.getMetadataFilters().stream(), createdFilter.getResourceId());

        return ResponseEntity
                        .created(getResourceUriFor(persistedMr, createdFilter.getResourceId()))
                        .body(persistedFilter);
    }

    @DeleteMapping("/Filters/{resourceId}")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable String metadataResolverId,
                    @PathVariable String resourceId) {

        MetadataResolver resolver = findResolverOrThrowHttp404(metadataResolverId);
        MetadataFilter filterToDelete = findFilterOrThrowHttp404(resourceId);

        //TODO: consider implementing delete of filter directly from RDBMS via FilterRepository
        //This is currently the only way to correctly delete and manage resolver-filter relationship
        //Until we implement a bi-directional relationship between them which turns out to be a much larger
        //change that we need to make in the entire code base
        List<MetadataFilter> updatedFilters = new ArrayList<>(resolver.getMetadataFilters());
        boolean removed = updatedFilters.removeIf(f -> f.getResourceId().equals(resourceId));
        if (!removed) {
            throw HTTP_404_CLIENT_ERROR_EXCEPTION.get();
        }
        resolver.setMetadataFilters(updatedFilters);
        //To support envers versioning from MetadataResolver side
        resolver.markAsModified();
        repository.save(resolver);
        filterRepository.delete(filterToDelete);

        //TODO: do we need to reload filters here?!?
        //metadataResolverService.reloadFilters(persistedMr.getName());

        return ResponseEntity.noContent().build();
    }

    private MetadataFilter findFilterOrThrowHttp404(String filterResourceId) {
        MetadataFilter filter = filterRepository.findByResourceId(filterResourceId);
        if (filter == null) {
            throw HTTP_404_CLIENT_ERROR_EXCEPTION.get();
        }
        return filter;
    }

    private MetadataResolver findResolverOrThrowHttp404(String resolverResourceId) {
        MetadataResolver resolver = repository.findByResourceId(resolverResourceId);
        if (resolver == null) {
            throw HTTP_404_CLIENT_ERROR_EXCEPTION.get();
        }
        return resolver;
    }

    @GetMapping("/Filters")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getAll(@PathVariable String metadataResolverId) {
        MetadataResolver resolver = findResolverOrThrowHttp404(metadataResolverId);
        return ResponseEntity.ok(resolver.getMetadataFilters());
    }

    @GetMapping("/Filters/{resourceId}")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getOne(@PathVariable String metadataResolverId, @PathVariable String resourceId) {
        MetadataResolver resolver = findResolverOrThrowHttp404(metadataResolverId);
        return ResponseEntity.ok(findFilterOrThrowHttp404(resourceId));
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

    private MetadataFilter newlyPersistedFilter(Stream<MetadataFilter> filters, final String filterResourceId) {
        MetadataFilter persistedFilter = filters
                        .filter(f -> f.getResourceId().equals(filterResourceId))
                        .collect(toList()).get(0);

        return persistedFilter;
    }

    @ExceptionHandler
    public ResponseEntity<?> notFoundHandler(HttpClientErrorException ex) {
        switch (ex.getStatusCode()) {
        case NOT_FOUND:
            return ResponseEntity.notFound().build();
        case BAD_REQUEST:
            return ResponseEntity.badRequest().build();
        default:
            throw ex;
        }
    }

    private void reloadFiltersAndHandleScriptException(String resolverResourceId) {
        try {
            metadataResolverService.reloadFilters(resolverResourceId);
        } catch (Throwable ex) {
            //explicitly mark transaction for rollback when we get ScriptException as we call reloadFilters
            //after persistence call. Then re-throw the exception
            //to let RestControllerSupport advice return proper 400 error message
            if (ex instanceof ScriptException) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                throw ex;
            }
        }
    }

    @PutMapping("/Filters/{resourceId}")
    @Transactional
    public ResponseEntity<?> update(@PathVariable String metadataResolverId,
                    @PathVariable String resourceId,
                    @RequestBody MetadataFilter updatedFilter) {

        MetadataResolver metadataResolver = findResolverOrThrowHttp404(metadataResolverId);

        //Now we operate directly on the filter attached to MetadataResolver,
        //Instead of fetching filter separately, to accommodate correct envers versioning with uni-directional one-to-many
        Optional<MetadataFilter> filterTobeUpdatedOptional = metadataResolver.getMetadataFilters()
                        .stream()
                        .filter(it -> it.getResourceId().equals(resourceId))
                        .findFirst();
        if (!filterTobeUpdatedOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        MetadataFilter filterTobeUpdated = filterTobeUpdatedOptional.get();
        if (!resourceId.equals(updatedFilter.getResourceId())) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        // Verify we're the only one attempting to update the filter
        if (updatedFilter.getVersion() != filterTobeUpdated.getVersion()) {
            return new ResponseEntity<Void>(HttpStatus.CONFLICT);
        }

        // perform validation if necessary on the entity ids (if the filter is the right configuration to need such a check)
        validateFilterOrThrowHttp400(updatedFilter);

        filterTobeUpdated.setName(updatedFilter.getName());
        filterTobeUpdated.setFilterEnabled(updatedFilter.isFilterEnabled());
        updatedFilter.updateConcreteFilterTypeData(filterTobeUpdated);

        MetadataFilter persistedFilter = filterRepository.save(filterTobeUpdated);

        //To support envers versioning from MetadataResolver side
        metadataResolver.markAsModified();
        repository.save(metadataResolver);

        // TODO: do we need to reload filters here?
        reloadFiltersAndHandleScriptException(metadataResolver.getResourceId());

        return ResponseEntity.ok().body(persistedFilter);
    }

    /**
     * IF the filter is of type "EntityAttributes" AND the target is "ENTITY" THEN check each of the values (which are entityIds)
     */
    private void validateFilterOrThrowHttp400(MetadataFilter createdFilter) {
        if ("EntityAttributes".equals(createdFilter.getType())) {
            EntityAttributesFilter filter = (EntityAttributesFilter) createdFilter;
            if ("ENTITY".equals(filter.getEntityAttributesFilterTarget().getEntityAttributesFilterTargetType())) {
                for (String entityId : filter.getEntityAttributesFilterTarget().getValue()) {
                    if (!groupService.doesStringMatchGroupPattern(userService.getCurrentUser().getGroupId(), entityId)) {
                        throw HTTP_400_BAD_REQUEST_EXCEPTION.get();
                    }
                }
            }
        }
    }
}