package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection;

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
     * @return org.opensaml.saml.saml2.metadata.EntityDescriptor opensaml model
     */
    org.opensaml.saml.saml2.metadata.EntityDescriptor createDescriptorFromRepresentation(final EntityDescriptorRepresentation representation);

    /**
     * @param ed - JPA EntityDescriptor to base creation on
     * @return EntityDescriptorRepresentation of the created object
     * @throws ForbiddenException If user is unauthorized to perform this operation
     * @throws ObjectIdExistsException If any EntityDescriptor already exists with the same EntityId
     */
    EntityDescriptorRepresentation createNew(EntityDescriptor ed)
                    throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException;

    /**
     * @param edRepresentation Incoming representation to save
     * @return EntityDescriptorRepresentation
     * @throws ForbiddenException If user is unauthorized to perform this operation
     * @throws ObjectIdExistsException If the entity already exists
     */
    EntityDescriptorRepresentation createNew(EntityDescriptorRepresentation edRepresentation)
                    throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException;

    /**
     * Map from opensaml implementation of entity descriptor model to front-end data representation of entity descriptor
     *
     * @param org.opensaml.saml.saml2.metadata.EntityDescriptor opensaml model
     * @return EntityDescriptorRepresentation
     */
    EntityDescriptorRepresentation createRepresentationFromDescriptor(final org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor);

    /**
     * @param resourceId - id of the JPA EntityDescriptor
     * @throws ForbiddenException If user is unauthorized to perform this operation
     * @throws PersistentEntityNotFound If the db entity is not found
     */
    void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound;

    /**
     * @return - Iterable set of EntityDescriptorRepresentations of those items which are NOT enabled and not owned by
     * "admin"
     * @throws ForbiddenException - If user is not an ADMIN
     */
    Iterable<EntityDescriptorProjection> getAllDisabledAndNotOwnedByAdmin() throws ForbiddenException;

    /**
     * @return a list of EntityDescriptorProjections that a user has the rights to access
     */
    List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsBasedOnUserAccess() throws ForbiddenException;

    /**
     * Given a list of attributes, generate an AttributeReleaseList
     *
     * @param attributeList the list of attributes to convert
     * @return an AttributeRelease list
     */
    List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList);

    /**
     * @param resourceId - id of the JPA EntityDescriptor
     * @return JPA EntityDescriptor
     * @throws ForbiddenException If user is unauthorized to perform this operation
     * @throws PersistentEntityNotFound If the db entity is not found
     */
    EntityDescriptor getEntityDescriptorByResourceId(String resourceId) throws PersistentEntityNotFound, ForbiddenException;

    /**
     * Given a list of attributes, generate a map of relying party overrides
     *
     * @param attributeList the list of attributes to generate from
     * @return a map of String->Object (property name -> property value) based on the given list of attributes
     */
    Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList);

    /**
     * @throws ForbiddenException If the user is not permitted to perform the action
     * @throws PersistentEntityNotFound If the entity doesn't already exist in the database
     * @throws ConcurrentModificationException IF the entity is being modified in another session
     * @throws InvalidPatternMatchException If the entity id or the ACS location urls don't match the supplied regex
     */
    EntityDescriptorRepresentation update(EntityDescriptorRepresentation edRepresentation)
                    throws ForbiddenException, PersistentEntityNotFound, ConcurrentModificationException,
                    InvalidPatternMatchException;

    /**
     * Update an instance of entity descriptor with information from the front-end representation
     *
     * @param entityDescriptor opensaml model instance to update
     * @param representation front end representation to use to update
     */
    void updateDescriptorFromRepresentation(final org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor, final EntityDescriptorRepresentation representation);

    EntityDescriptorRepresentation updateEntityDescriptorEnabledStatus(String resourceId, boolean status) throws
                    PersistentEntityNotFound, ForbiddenException;

    EntityDescriptorRepresentation createNewEntityDescriptorFromXMLOrigin(EntityDescriptor ed);

    boolean entityExists(String entityID);

    EntityDescriptorRepresentation updateGroupForEntityDescriptor(String resourceId, String groupId);

    EntityDescriptorRepresentation changeApproveStatusOfEntityDescriptor(String resourceId, boolean status) throws PersistentEntityNotFound, ForbiddenException;

    List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess();
}