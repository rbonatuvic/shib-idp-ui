package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

/**
 * Default implementation of {@link FilterService}
 *
 * @since 1.0
 * @author Bill Smith (wsmith@unicon.net)
 */
public class JPAFilterServiceImpl implements FilterService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JPAFilterServiceImpl.class);

    @Autowired
    EntityDescriptorService entityDescriptorService;

    @Autowired
    EntityService entityService;

    @Autowired
    FilterTargetService filterTargetService;

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
}
