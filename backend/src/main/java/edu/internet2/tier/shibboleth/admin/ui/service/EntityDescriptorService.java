package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.RelyingPartyOverridesRepresentation;
import org.opensaml.saml.saml2.metadata.EntityDescriptor;

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
     * Update an instance of entity descriptor with information from the front-end representation
     *
     * @param entityDescriptor opensaml model instance to update
     * @param representation   front end representation to use to update
     */
    void updateDescriptorFromRepresentation(final EntityDescriptor entityDescriptor, final EntityDescriptorRepresentation representation);

    /**
     * Given a list of attributes, generate an AttributeReleaseList
     *
     * @param attributeList the list of attributes to convert
     * @return an AttributeRelease list
     */
    List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList);

    /**
     * Given a list of attributes, generate a RelyingPartyOverridesRepresentation
     *
     * @param attributeList the list of attributes to generate from
     * @return a RelyingPartyOverridesRepresentation based on the given list of attributes
     */
    Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList);

}