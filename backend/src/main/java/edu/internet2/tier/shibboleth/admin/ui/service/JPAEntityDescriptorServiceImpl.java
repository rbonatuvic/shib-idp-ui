package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.*;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.*;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.EntityNotFoundException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidUrlMatchException;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.*;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getStringListOfAttributeValues;

@Slf4j
@Service
public class JPAEntityDescriptorServiceImpl implements EntityDescriptorService {
    @Autowired
    EntityDescriptorRepository entityDescriptorRepository;
    
    @Autowired
    IGroupService groupService;
    
    @Autowired
    private OpenSamlObjects openSamlObjects;
    
    @Autowired
    private OwnershipRepository ownershipRepository;

    @Autowired
    UserService userService;
    
    private EntityDescriptor buildDescriptorFromRepresentation(final EntityDescriptor ed, final EntityDescriptorRepresentation representation) {
        ed.setEntityID(representation.getEntityId());
        ed.setIdOfOwner(representation.getIdOfOwner());

        setupSPSSODescriptor(ed, representation);
        ed.setServiceProviderName(representation.getServiceProviderName());
        ed.setServiceEnabled(representation.isServiceEnabled());
        setupOrganization(ed, representation);
        setupContacts(ed, representation);
        setupUIInfo(ed, representation);
        setupSecurity(ed, representation);
        setupACSs(ed, representation);
        setupLogout(ed, representation);
        setupRelyingPartyOverrides(ed, representation);

        //Let envers recognize update revision type for EntityDescriptor type
        //when modifying Attributes and SPSSODescriptor inside RoleDescriptors collection
        ed.setVersionModifiedTimestamp(System.currentTimeMillis());

        return ed;
    }

    @Override
    public EntityDescriptor createDescriptorFromRepresentation(final EntityDescriptorRepresentation representation) {
        EntityDescriptor ed = openSamlObjects.buildDefaultInstanceOfType(EntityDescriptor.class);
        return buildDescriptorFromRepresentation(ed, representation);
    }

    @Override
    public EntityDescriptorRepresentation createNew(EntityDescriptor ed)
                    throws ForbiddenException, EntityIdExistsException, InvalidUrlMatchException {
        return createNew(createRepresentationFromDescriptor(ed));
    }
    
    @Override
    public EntityDescriptorRepresentation createNew(EntityDescriptorRepresentation edRep)
                    throws ForbiddenException, EntityIdExistsException, InvalidUrlMatchException {
        if (edRep.isServiceEnabled() && !userService.currentUserIsAdmin()) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service.");
        }
        
        if (entityDescriptorRepository.findByEntityID(edRep.getEntityId()) != null) {
            throw new EntityIdExistsException(edRep.getEntityId());
        }

        // "Create new" will use the current user's group as the owner
        String ownerId = userService.getCurrentUserGroup().getOwnerId();
        edRep.setIdOfOwner(ownerId);
        validateEntityIdAndACSUrls(edRep);

        EntityDescriptor ed = (EntityDescriptor) createDescriptorFromRepresentation(edRep);
        ed.setIdOfOwner(ownerId);

        return createRepresentationFromDescriptor(entityDescriptorRepository.save(ed));
    }

    @Override
    public EntityDescriptorRepresentation createRepresentationFromDescriptor(org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor) {
        EntityDescriptor ed = (EntityDescriptor) entityDescriptor;
        EntityDescriptorRepresentation representation = new EntityDescriptorRepresentation();

        representation.setId(ed.getResourceId());
        representation.setEntityId(ed.getEntityID());
        representation.setServiceProviderName(ed.getServiceProviderName());
        representation.setServiceEnabled(ed.isServiceEnabled());
        representation.setCreatedDate(ed.getCreatedDate());
        representation.setModifiedDate(ed.getModifiedDate());
        representation.setVersion(ed.hashCode());
        representation.setCreatedBy(ed.getCreatedBy());
        representation.setCurrent(ed.isCurrent());
        representation.setIdOfOwner(ed.getIdOfOwner());

        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getSupportedProtocols().size() > 0) {
            ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptorRepresentation = representation.getServiceProviderSsoDescriptor(true);
            serviceProviderSsoDescriptorRepresentation.setProtocolSupportEnum(String.join(",", ed.getSPSSODescriptor("").getSupportedProtocols().stream().map(p -> MDDCConstants.PROTOCOL_BINDINGS.get(p)).collect(Collectors.toList())));
        }

        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getNameIDFormats().size() > 0) {
            ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptorRepresentation = representation.getServiceProviderSsoDescriptor(true);
            serviceProviderSsoDescriptorRepresentation.setNameIdFormats(
                    ed.getSPSSODescriptor("").getNameIDFormats().stream().map(p -> p.getFormat()).collect(Collectors.toList())
            );
        }

        if (ed.getOrganization() != null) {
            // set up organization
            OrganizationRepresentation organizationRepresentation = new OrganizationRepresentation();
            organizationRepresentation.setName(ed.getOrganization().getOrganizationNames().get(0).getValue());
            organizationRepresentation.setDisplayName(ed.getOrganization().getDisplayNames().get(0).getValue());
            organizationRepresentation.setUrl(ed.getOrganization().getURLs().get(0).getValue());
            representation.setOrganization(organizationRepresentation);
        }

        if (ed.getContactPersons() != null && ed.getContactPersons().size() > 0) {
            // set up contact persons
            List<ContactRepresentation> contactRepresentations = new ArrayList<>();
            for (org.opensaml.saml.saml2.metadata.ContactPerson contactPerson : ed.getContactPersons()) {
                ContactRepresentation contactRepresentation = new ContactRepresentation();

                if (contactPerson.getType() != null) {
                    contactRepresentation.setType(contactPerson.getType().toString());
                }
                if (contactPerson.getGivenName() != null) {
                    contactRepresentation.setName(contactPerson.getGivenName().getName());
                }
                if (contactPerson.getEmailAddresses() != null && contactPerson.getEmailAddresses().size() > 0) {
                    contactRepresentation.setEmailAddress(contactPerson.getEmailAddresses().get(0).getAddress());
                }

                contactRepresentations.add(contactRepresentation);
            }
            representation.setContacts(contactRepresentations);
        }

        // set up MDUI
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getExtensions() != null && ed.getSPSSODescriptor("").getExtensions().getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).size() == 1) {
            UIInfo uiInfo = (UIInfo) ed.getSPSSODescriptor("").getExtensions().getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).get(0);
            MduiRepresentation mduiRepresentation = new MduiRepresentation();
            representation.setMdui(mduiRepresentation);

            if (uiInfo.getDisplayNames().size() > 0) {
                mduiRepresentation.setDisplayName(uiInfo.getDisplayNames().get(0).getValue());
            }
            if (uiInfo.getInformationURLs().size() > 0) {
                mduiRepresentation.setInformationUrl(uiInfo.getInformationURLs().get(0).getValue());
            }
            if (uiInfo.getPrivacyStatementURLs().size() > 0) {
                mduiRepresentation.setPrivacyStatementUrl(uiInfo.getPrivacyStatementURLs().get(0).getValue());
            }
            if (uiInfo.getDescriptions().size() > 0) {
                mduiRepresentation.setDescription(uiInfo.getDescriptions().get(0).getValue());
            }
            if (uiInfo.getLogos().size() > 0) {
                org.opensaml.saml.ext.saml2mdui.Logo logo = uiInfo.getLogos().get(0);
                mduiRepresentation.setLogoUrl(logo.getURL());
                mduiRepresentation.setLogoHeight(logo.getHeight());
                mduiRepresentation.setLogoWidth(logo.getWidth());
            }
        }

        // set up security
        // TODO: cleanup, probably use a lazy initializer
        SecurityInfoRepresentation securityInfoRepresentation = representation.getSecurityInfo();
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getWantAssertionsSigned() != null && ed.getSPSSODescriptor("").getWantAssertionsSigned()) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }
            securityInfoRepresentation.setWantAssertionsSigned(true);
        }
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").isAuthnRequestsSigned() != null && ed.getSPSSODescriptor("").isAuthnRequestsSigned()) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }
            securityInfoRepresentation.setAuthenticationRequestsSigned(true);
        }
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getKeyDescriptors().size() > 0) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }
            securityInfoRepresentation.setX509CertificateAvailable(true);
            for (org.opensaml.saml.saml2.metadata.KeyDescriptor keyDescriptor : ed.getSPSSODescriptor("").getKeyDescriptors()) {
                SecurityInfoRepresentation.X509CertificateRepresentation x509CertificateRepresentation = new SecurityInfoRepresentation.X509CertificateRepresentation();
                x509CertificateRepresentation.setName(((KeyDescriptor) keyDescriptor).getName());
                //TODO: check this. assume that if no value is set, it's used for both
                if (keyDescriptor.getUse() != null) {
                    x509CertificateRepresentation.setType(keyDescriptor.getUse().toString().toLowerCase());
                } else {
                    x509CertificateRepresentation.setType("both");
                }
                x509CertificateRepresentation.setValue(keyDescriptor.getKeyInfo().getX509Datas().get(0).getX509Certificates().get(0).getValue());
                securityInfoRepresentation.getX509Certificates().add(x509CertificateRepresentation);
            }
        }

        // set up ACSs
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getAssertionConsumerServices().size() > 0) {
            if (representation.getAssertionConsumerServices() == null) {
                representation.setAssertionConsumerServices(new ArrayList<>());
            }
            for (org.opensaml.saml.saml2.metadata.AssertionConsumerService assertionConsumerService : ed.getSPSSODescriptor("").getAssertionConsumerServices()) {
                AssertionConsumerServiceRepresentation assertionConsumerServiceRepresentation = new AssertionConsumerServiceRepresentation();

                Boolean isDefault = assertionConsumerService.isDefault();
                assertionConsumerServiceRepresentation.setMakeDefault(isDefault == null ? false : isDefault);
                assertionConsumerServiceRepresentation.setBinding(assertionConsumerService.getBinding());
                assertionConsumerServiceRepresentation.setLocationUrl(assertionConsumerService.getLocation());

                representation.getAssertionConsumerServices().add(assertionConsumerServiceRepresentation);
            }
        }

        // set up logout endpoints
        if (ed.getSPSSODescriptor("") != null && !ed.getSPSSODescriptor("").getSingleLogoutServices().isEmpty()) {
            for (org.opensaml.saml.saml2.metadata.SingleLogoutService singleLogoutService : ed.getSPSSODescriptor("").getSingleLogoutServices()) {
                LogoutEndpointRepresentation logoutEndpointRepresentation = new LogoutEndpointRepresentation();
                logoutEndpointRepresentation.setBindingType(singleLogoutService.getBinding());
                logoutEndpointRepresentation.setUrl(singleLogoutService.getLocation());
                representation.getLogoutEndpoints(true).add(logoutEndpointRepresentation);
            }
        }

        // set up extensions
        if (ed.getExtensions() != null && ed.getExtensions().getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME) != null && ed.getExtensions().getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).size() == 1) {
            // we have entity attributes (hopefully), so should have overrides
            Map<String, Object> relyingPartyOverrides = new HashMap<>();

            for (org.opensaml.saml.saml2.core.Attribute attribute : ((EntityAttributes) ed.getExtensions().getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).get(0)).getAttributes()) {
                Attribute jpaAttribute = (Attribute) attribute;

                if (jpaAttribute.getName().equals(MDDCConstants.RELEASE_ATTRIBUTES)) {
                    representation.setAttributeRelease(getStringListOfAttributeValues(attribute.getAttributeValues()));
                } else {
                    Optional override = ModelRepresentationConversions.getOverrideByAttributeName(jpaAttribute.getName());
                    if (override.isPresent()) {
                        IRelyingPartyOverrideProperty overrideProperty = (IRelyingPartyOverrideProperty)override.get();
                        Object attributeValues = null;
                        switch (ModelRepresentationConversions.AttributeTypes.valueOf(overrideProperty.getDisplayType().toUpperCase())) {
                            case STRING:
                            case LONG:
                            case DOUBLE:
                            case DURATION:
                            case SPRING_BEAN_ID:
                                if (jpaAttribute.getAttributeValues().size() != 1) {
                                    throw new RuntimeException("Multiple/No values detected where one is expected!");
                                }
                                attributeValues = ModelRepresentationConversions.getValueFromXMLObject(jpaAttribute.getAttributeValues().get(0));
                                break;
                            case INTEGER:
                                if (jpaAttribute.getAttributeValues().size() != 1) {
                                    throw new RuntimeException("Multiple/No values detected where one is expected!");
                                }
                                attributeValues = ((XSInteger)jpaAttribute.getAttributeValues().get(0)).getValue();
                                break;
                            case BOOLEAN:
                                if (jpaAttribute.getAttributeValues().size() != 1) {
                                    throw new RuntimeException("Multiple/No values detected where one is expected!");
                                }
                                if (overrideProperty.getPersistType() != null &&
                                    !overrideProperty.getPersistType().equals(overrideProperty.getDisplayType())) {
                                    attributeValues = overrideProperty.getPersistValue().equals(ModelRepresentationConversions.getValueFromXMLObject(jpaAttribute.getAttributeValues().get(0)));
                                } else {
                                    attributeValues = Boolean.valueOf(overrideProperty.getInvert()) ^ Boolean.valueOf(((XSBoolean) jpaAttribute.getAttributeValues()
                                            .get(0)).getStoredValue());
                                }
                                break;
                            case SET:
                            case LIST:
                            case SELECTION_LIST:
                                attributeValues = jpaAttribute.getAttributeValues().stream()
                                        .map(attributeValue -> ModelRepresentationConversions.getValueFromXMLObject(attributeValue))
                                        .collect(Collectors.toList());
                        }
                        relyingPartyOverrides.put(((IRelyingPartyOverrideProperty) override.get()).getName(), attributeValues);
                    }
                }
            }

            representation.setRelyingPartyOverrides(relyingPartyOverrides);
        }

        return representation;
    }

    @Override
    public void delete(String resourceId) throws ForbiddenException, EntityNotFoundException {
        EntityDescriptor ed = getEntityDescriptorByResourceId(resourceId);
        if (ed.isServiceEnabled()) {
            throw new ForbiddenException("Deleting an enabled Metadata Source is not allowed. Disable the source and try again.");
        }
        ownershipRepository.deleteEntriesForOwnedObject(ed);
        entityDescriptorRepository.delete(ed);

    }

    @Override
    public Iterable<EntityDescriptorRepresentation> getAllDisabledAndNotOwnedByAdmin() throws ForbiddenException {
        if (!userService.currentUserIsAdmin()) {
            throw new ForbiddenException();
        }
        return entityDescriptorRepository.findAllDisabledAndNotOwnedByAdmin().map(ed -> createRepresentationFromDescriptor(ed)).collect(Collectors.toList());
    }

    @Override
    public List<EntityDescriptorRepresentation> getAllRepresentationsBasedOnUserAccess() throws ForbiddenException {
        switch (userService.getCurrentUserAccess()) {
        case ADMIN:
            return entityDescriptorRepository.findAllStreamByCustomQuery().map(ed -> createRepresentationFromDescriptor(ed))
                            .collect(Collectors.toList());
        case GROUP:
            User user = userService.getCurrentUser();
            Group group = user.getGroup();
            return entityDescriptorRepository.findAllStreamByIdOfOwner(group.getOwnerId())
                            .map(ed -> createRepresentationFromDescriptor(ed)).collect(Collectors.toList());
        default:
            throw new ForbiddenException();
        }
    }

    @Override
    public List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList) {
        return ModelRepresentationConversions.getAttributeReleaseListFromAttributeList(attributeList);
    }

    @Override
    public EntityDescriptor getEntityDescriptorByResourceId(String resourceId) throws EntityNotFoundException, ForbiddenException {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            throw new EntityNotFoundException(String.format("The entity descriptor with entity id [%s] was not found.", resourceId));
        }
        if (!userService.isAuthorizedFor(ed)) {
            throw new ForbiddenException();
        }
        return ed;
    }

    @Override
    public Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList) {
        return ModelRepresentationConversions.getRelyingPartyOverridesRepresentationFromAttributeList(attributeList);
    }

    @Override
    public EntityDescriptorRepresentation update(EntityDescriptorRepresentation edRep)
                    throws ForbiddenException, EntityNotFoundException, InvalidUrlMatchException {
        EntityDescriptor existingEd = entityDescriptorRepository.findByResourceId(edRep.getId());
        if (existingEd == null) {
            throw new EntityNotFoundException(String.format("The entity descriptor with entity id [%s] was not found for update.", edRep.getId()));
        }
        if (edRep.isServiceEnabled() && !userService.currentUserIsAdmin()) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service.");
        }
        if (!userService.isAuthorizedFor(existingEd)) {
            throw new ForbiddenException();
        }
        // Verify we're the only one attempting to update the EntityDescriptor
        if (edRep.getVersion() != existingEd.hashCode()) {
            throw new ConcurrentModificationException(String.format("A concurrent modification has occured on entity descriptor with entity id [%s]. Please refresh and try again", edRep.getId()));
        }

        validateEntityIdAndACSUrls(edRep);
        updateDescriptorFromRepresentation(existingEd, edRep);
        return createRepresentationFromDescriptor(entityDescriptorRepository.save(existingEd));
    }

    @Override
    public void updateDescriptorFromRepresentation(org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor, EntityDescriptorRepresentation representation) {
        if (!(entityDescriptor instanceof EntityDescriptor)) {
            throw new UnsupportedOperationException("not yet implemented");
        }
        buildDescriptorFromRepresentation((EntityDescriptor) entityDescriptor, representation);
    }

    private void validateEntityIdAndACSUrls(EntityDescriptorRepresentation edRep) throws InvalidUrlMatchException {
        // Check the entity id first
        if (!groupService.doesStringMatchGroupPattern(edRep.getIdOfOwner(), edRep.getEntityId())) {
            throw new InvalidUrlMatchException("EntityId is not a pattern match to the group");
        }

        // Check the ACS locations
        if (edRep.getAssertionConsumerServices() != null && edRep.getAssertionConsumerServices().size() > 0) {
            for (AssertionConsumerServiceRepresentation acs : edRep.getAssertionConsumerServices()) {
                if (!groupService.doesStringMatchGroupPattern(edRep.getIdOfOwner(), acs.getLocationUrl())) {
                    throw new InvalidUrlMatchException(
                                    "ACS location [ " + acs.getLocationUrl() + " ] is not a pattern match to the group");
                }
            }
        }
    }
}