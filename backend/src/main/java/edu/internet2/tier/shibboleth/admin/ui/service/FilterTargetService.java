package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesFilterTarget;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterTargetRepresentation;

/**
 * Main backend facade API that defines operations pertaining to manipulating <code>{@link EntityAttributesFilter}</code> objects.
 *
 * @since 1.0
 */
public interface FilterTargetService {

    /**
     * Map from front-end data representation of Filter Target to Entity Attributes Filter Target
     *
     * @param representation of attributes filter coming from front end layer
     * @return EntityAttributesFilterTarget'
     */
    EntityAttributesFilterTarget createFilterTargetFromRepresentation(final FilterTargetRepresentation representation);

    /**
     * Map from Entity Attributes Filter Target to front-end data representation
     *
     * @param entityAttributesFilterTarget
     * @return FilterTargetRepresentation front end representation
     */
    FilterTargetRepresentation createRepresentationFromFilterTarget(final EntityAttributesFilterTarget entityAttributesFilterTarget) ;
}
