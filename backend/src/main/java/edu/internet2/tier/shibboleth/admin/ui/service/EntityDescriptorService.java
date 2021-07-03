package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;

import org.opensaml.saml.saml2.metadata.EntityDescriptor;

import java.util.ConcurrentModificationException;
import java.util.List;
import java.util.Map;

/**
 * Main backend facade API that defines operations pertaining to manipulating <code>{@link EntityDescriptor}</code> state.
 *
 * @since 1.0
 */
public interface EntityDescriptorService {
    /**
     * Map from front-end data representation of entity descriptor to opensaml implementation of entity descriptor model
     *
     * @param representation of entity descriptor coming from front end layer
     * @return EntityDescriptor
     */
    EntityDescriptor createDescriptorFromRepresentation(final EntityDescriptorRepresentation representation);

    /**
     * Map from opensaml implementation of entity descriptor model to front-end data representation of entity descriptor
     *
     * @param entityDescriptor opensaml model
     * @return EntityDescriptorRepresentation
     */
    EntityDescriptorRepresentation createRepresentationFromDescriptor(final EntityDescriptor entityDescriptor);

    /**
     * @return a list of EntityDescriptorRepresentations that a user has the rights to access
     */
    List<EntityDescriptorRepresentation> getAllRepresentationsBasedOnUserAccess() throws ForbiddenException;
    
    /**
     * Given a list of attributes, generate an AttributeReleaseList
     *
     * @param attributeList the list of attributes to convert
     * @return an AttributeRelease list
     */
    List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList);

    /**
     * Given a list of attributes, generate a map of relying party overrides
     *
     * @param attributeList the list of attributes to generate from
     * @return a map of String->Object (property name -> property value) based on the given list of attributes
     */
    Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList);

    /**
     * Update an instance of entity descriptor with information from the front-end representation
     *
     * @param entityDescriptor opensaml model instance to update
     * @param representation   front end representation to use to update
     */
    void updateDescriptorFromRepresentation(final EntityDescriptor entityDescriptor, final EntityDescriptorRepresentation representation);

    EntityDescriptorRepresentation createNew(EntityDescriptorRepresentation edRepresentation) throws ForbiddenException, EntityIdExistsException;
    
    EntityDescriptorRepresentation update(EntityDescriptorRepresentation edRepresentation) throws ForbiddenException, EntityNotFoundException, ConcurrentModificationException;

    edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor getEntityDescriptorByResourceId(String resourceId) throws EntityNotFoundException;

}