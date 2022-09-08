package edu.internet2.tier.shibboleth.admin.ui.service;

import javax.script.ScriptException;

import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.FilterRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;

/**
 * Main backend facade API that defines operations pertaining to manipulating <code>{@link EntityAttributesFilter}</code> objects.
 *
 * @since 1.0
 */
public interface FilterService {

    /**
     * Map from front-end data representation of attributes filter entity attributes filter model
     *
     * @param representation of attributes filter coming from front end layer
     * @return EntityAttributesFilter
     */
    EntityAttributesFilter createFilterFromRepresentation(final FilterRepresentation representation);

    /**
     * Map from opensaml implementation of entity descriptor model to front-end data representation of entity descriptor
     *
     * @param entityAttributesFilter
     * @return FilterRepresentation front end representation
     */
    FilterRepresentation createRepresentationFromFilter(final EntityAttributesFilter entityAttributesFilter);

    MetadataFilter updateFilterEnabledStatus(String metadataResolverId, String resourceId, boolean status) throws
                    PersistentEntityNotFound, ForbiddenException, ScriptException;
}