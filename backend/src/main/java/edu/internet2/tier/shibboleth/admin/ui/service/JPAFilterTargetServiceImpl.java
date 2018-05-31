package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilterTarget;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class JPAFilterTargetServiceImpl implements FilterTargetService {
    @Override
    public EntityAttributesFilterTarget createFilterTargetFromRepresentation(FilterTargetRepresentation representation) {
        EntityAttributesFilterTarget filterTarget = new EntityAttributesFilterTarget();

        filterTarget.setValue(representation.getValue());
        filterTarget.setEntityAttributesFilterTargetType(
                EntityAttributesFilterTarget.EntityAttributesFilterTargetType.valueOf(representation.getType()));

        return filterTarget;
    }

    @Override
    public FilterTargetRepresentation createRepresentationFromFilterTarget(EntityAttributesFilterTarget entityAttributesFilterTarget) {
        FilterTargetRepresentation representation = new FilterTargetRepresentation();

        representation.setValue(entityAttributesFilterTarget.getValue());
        representation.setType(entityAttributesFilterTarget.getEntityAttributesFilterTargetType().name());
        representation.setVersion(entityAttributesFilterTarget.hashCode());

        return representation;
    }
}
