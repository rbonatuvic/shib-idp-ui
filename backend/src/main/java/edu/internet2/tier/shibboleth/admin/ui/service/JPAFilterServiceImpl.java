package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolver;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.repository.FilterRepository;
import edu.internet2.tier.shibboleth.admin.ui.repository.MetadataResolverRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.script.ScriptException;

/**
 * Default implementation of {@link FilterService}
 *
 * @since 1.0
 * @author Bill Smith (wsmith@unicon.net)
 */
@Service
public class JPAFilterServiceImpl implements FilterService {
    @Autowired
    EntityDescriptorService entityDescriptorService;
    
    @Autowired
    EntityService entityService;

    @Autowired
    FilterRepository filterRepository;

    @Autowired
    FilterTargetService filterTargetService;
    
    @Autowired
    private MetadataResolverRepository metadataResolverRepository;
    
    @Autowired
    private MetadataResolverService metadataResolverService;

    @Autowired
    private UserService userService;
    
    @Override
    public EntityAttributesFilter createFilterFromRepresentation(FilterRepresentation representation) {
        //TODO? use OpenSamlObjects.buildDefaultInstanceOfType(EntityAttributesFilter.class)?
        EntityAttributesFilter filter = new EntityAttributesFilter();

        filter.setName(representation.getFilterName());
        filter.setFilterEnabled(representation.isFilterEnabled());

        List<org.opensaml.saml.saml2.core.Attribute> attributeList = new ArrayList<>();
        attributeList.addAll(entityService.getAttributeListFromAttributeReleaseList(representation.getAttributeRelease()));
        attributeList.addAll(entityService.getAttributeListFromRelyingPartyOverridesRepresentation(representation.getRelyingPartyOverrides()));
        filter.setAttributes((List<edu.internet2.tier.shibboleth.admin.ui.domain.Attribute>)(List<? extends org.opensaml.saml.saml2.core.Attribute>)attributeList); // this makes me a sad panda.

        filter.setEntityAttributesFilterTarget(filterTargetService.createFilterTargetFromRepresentation(representation.getFilterTarget()));

        return filter;
    }

    @Override
    public FilterRepresentation createRepresentationFromFilter(EntityAttributesFilter entityAttributesFilter) {
        FilterRepresentation representation = new FilterRepresentation();

        representation.setId(entityAttributesFilter.getResourceId());
        representation.setFilterName(entityAttributesFilter.getName());
        representation.setFilterEnabled(entityAttributesFilter.isFilterEnabled());
        representation.setCreatedDate(entityAttributesFilter.getCreatedDate());
        representation.setModifiedDate(entityAttributesFilter.getModifiedDate());

        representation.setAttributeRelease(
                entityDescriptorService.getAttributeReleaseListFromAttributeList(entityAttributesFilter.getAttributes()));
        representation.setRelyingPartyOverrides(
                entityDescriptorService.getRelyingPartyOverridesRepresentationFromAttributeList(entityAttributesFilter.getAttributes()));

        representation.setFilterTarget(filterTargetService.createRepresentationFromFilterTarget(entityAttributesFilter.getEntityAttributesFilterTarget()));

        representation.setVersion(entityAttributesFilter.hashCode());
        return representation;
    }

    private void reloadFiltersAndHandleScriptException(String resolverResourceId) throws ScriptException {
        try {
            metadataResolverService.reloadFilters(resolverResourceId);
        } catch (Throwable ex) {
            //explicitly mark transaction for rollback when we get ScriptException as we call reloadFilters
            //after persistence call. Then re-throw the exception with pertinent message
            if (ex instanceof ScriptException) {
                TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
                throw new ScriptException("Caught invalid script parsing error when reloading filters. Please fix the script data");
            }
        }
    }
    
    /**
     * Logic taken directly from the MetadataFiltersController and then modified slightly.
     */
    @Override
    public MetadataFilter updateFilterEnabledStatus(String metadataResolverId, String resourceId, boolean status)
                    throws EntityNotFoundException, ForbiddenException, ScriptException {
        
        MetadataResolver metadataResolver = metadataResolverRepository.findByResourceId(metadataResolverId);
        // Now we operate directly on the filter attached to MetadataResolver,
        // Instead of fetching filter separately, to accommodate correct envers versioning with uni-directional one-to-many
        Optional<MetadataFilter> filterTobeUpdatedOptional = metadataResolver.getMetadataFilters().stream()
                        .filter(it -> it.getResourceId().equals(resourceId)).findFirst();
        if (filterTobeUpdatedOptional.isEmpty()) {
            throw new EntityNotFoundException("Filter with resource id[" + resourceId + "] not found");
        }

        MetadataFilter filterTobeUpdated = filterTobeUpdatedOptional.get();

        if (!userService.currentUserCanEnable(filterTobeUpdated)) {
            throw new ForbiddenException("You do not have the permissions necessary to change the enable status of this filter.");
        }

        filterTobeUpdated.setFilterEnabled(status);
        MetadataFilter persistedFilter = filterRepository.save(filterTobeUpdated);

        // To support envers versioning from MetadataResolver side
        metadataResolver.markAsModified();
        metadataResolverRepository.save(metadataResolver);

        // TODO: do we need to reload filters here?
        reloadFiltersAndHandleScriptException(metadataResolver.getResourceId());

        return persistedFilter;
    }
}