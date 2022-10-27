package edu.internet2.tier.shibboleth.admin.ui.service;

import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorProtocol;
import edu.internet2.tier.shibboleth.admin.ui.domain.IRelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.KeyDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.UIInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.X509Data;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSInteger;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.KeyDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.OAuthRPExtensions;
import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.ValueXMLObject;
import edu.internet2.tier.shibboleth.admin.ui.exception.ForbiddenException;
import edu.internet2.tier.shibboleth.admin.ui.exception.InvalidPatternMatchException;
import edu.internet2.tier.shibboleth.admin.ui.exception.ObjectIdExistsException;
import edu.internet2.tier.shibboleth.admin.ui.exception.PersistentEntityNotFound;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection;
import edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Owner;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnerType;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import edu.internet2.tier.shibboleth.admin.ui.security.model.User;
import edu.internet2.tier.shibboleth.admin.ui.security.repository.OwnershipRepository;
import edu.internet2.tier.shibboleth.admin.ui.security.service.IGroupService;
import edu.internet2.tier.shibboleth.admin.ui.security.service.UserService;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.opensaml.core.xml.XMLObject;
import org.opensaml.xmlsec.signature.KeyInfo;
import org.opensaml.xmlsec.signature.KeyName;
import org.opensaml.xmlsec.signature.KeyValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.ConcurrentModificationException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupACSs;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupContacts;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupLogout;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupOrganization;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupRelyingPartyOverrides;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupSPSSODescriptor;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupSecurity;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConversionUtils.setupUIInfo;
import static edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions.getStringListOfAttributeValues;

@Slf4j
@Service
public class JPAEntityDescriptorServiceImpl implements EntityDescriptorService {
    @Autowired
    private EntityDescriptorRepository entityDescriptorRepository;

    @Autowired
    IGroupService groupService;

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @Autowired
    private OwnershipRepository ownershipRepository;

    @Autowired
    private UserService userService;

    private EntityDescriptor buildDescriptorFromRepresentation(final EntityDescriptor ed, final EntityDescriptorRepresentation representation) {
        ed.setEntityID(representation.getEntityId());
        ed.setIdOfOwner(representation.getIdOfOwner());
        ed.setProtocol(representation.getProtocol()); // SAML vs OIDC

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

        if (ed.getProtocol() == EntityDescriptorProtocol.OIDC && ed.getSPSSODescriptor("") != null) {
            ed.getSPSSODescriptor("").addSupportedProtocol("http://openid.net/specs/openid-connect-core-1_0.html");
        }
        //Let envers recognize update revision type for EntityDescriptor type
        //when modifying Attributes and SPSSODescriptor inside RoleDescriptors collection
        ed.setVersionModifiedTimestamp(System.currentTimeMillis());

        return ed;
    }

    /**
     * Currently only supporting oidcmd:OAuthRPExtensions in the extensions block
     */
    private Map<String, Object> buildOAuthRPExtensionsMap(EntityDescriptor ed) {
        HashMap<String, Object> result = new HashMap<>();
        if (!ed.getSPSSODescriptor("").getOptionalExtensions().isPresent()) {
            return result;
        }
        for(XMLObject extension : ed.getSPSSODescriptor("").getExtensions().getOrderedChildren()) {
            if (extension.getElementQName().getLocalPart().equals(OAuthRPExtensions.TYPE_LOCAL_NAME)){
                OAuthRPExtensions oAuthRPExtensions = (OAuthRPExtensions) extension;
                HashMap<String, Object> attributeMap = new HashMap();
                attributeMap.put("applicationType", oAuthRPExtensions.getApplicationType());
                attributeMap.put("clientUri", oAuthRPExtensions.getClientUri());
                attributeMap.put("defaultMaxAge", oAuthRPExtensions.getDefaultMaxAge());
                attributeMap.put("grantTypes", oAuthRPExtensions.getGrantTypes());
                attributeMap.put("idTokenEncryptedResponseAlg", oAuthRPExtensions.getIdTokenEncryptedResponseAlg());
                attributeMap.put("idTokenEncryptedResponseEnc", oAuthRPExtensions.getIdTokenEncryptedResponseEnc());
                attributeMap.put("idTokenSignedResponseAlg", oAuthRPExtensions.getIdTokenSignedResponseAlg());
                attributeMap.put("initiateLoginUri", oAuthRPExtensions.getInitiateLoginUri());
                attributeMap.put("requestObjectEncryptionAlg", oAuthRPExtensions.getRequestObjectEncryptionAlg());
                attributeMap.put("requestObjectEncryptionEnc", oAuthRPExtensions.getRequestObjectEncryptionEnc());
                attributeMap.put("requestObjectSigningAlg", oAuthRPExtensions.getRequestObjectSigningAlg());
                attributeMap.put("requireAuthTime", oAuthRPExtensions.isRequireAuthTime());
                attributeMap.put("responseTypes", oAuthRPExtensions.getResponseTypes());
                attributeMap.put("scopes", oAuthRPExtensions.getScopes());
                attributeMap.put("sectorIdentifierUri", oAuthRPExtensions.getSectorIdentifierUri());
                attributeMap.put("softwareId", oAuthRPExtensions.getSoftwareId());
                attributeMap.put("softwareVersion", oAuthRPExtensions.getSoftwareVersion());
                attributeMap.put("tokenEndpointAuthMethod", oAuthRPExtensions.getTokenEndpointAuthMethod());
                attributeMap.put("tokenEndpointAuthSigningAlg", oAuthRPExtensions.getTokenEndpointAuthSigningAlg());
                attributeMap.put("userInfoSignedResponseAlg", oAuthRPExtensions.getUserInfoSignedResponseAlg());
                attributeMap.put("userInfoEncryptedResponseAlg", oAuthRPExtensions.getUserInfoEncryptedResponseAlg());
                attributeMap.put("userInfoEncryptedResponseEnc", oAuthRPExtensions.getUserInfoEncryptedResponseEnc());
                result.put("attributes", attributeMap);
                // spit out the children
                if (oAuthRPExtensions.getRequestUris().size() > 0){
                    List<String> requestUris = new ArrayList<>();
                    oAuthRPExtensions.getRequestUris().forEach(requestUri -> requestUris.add(requestUri.getValue()));
                    result.put("requestUris", requestUris);
                }
                if (oAuthRPExtensions.getPostLogoutRedirectUris().size() > 0){
                    List<String> postLogoutRedirectUris = new ArrayList<>();
                    oAuthRPExtensions.getPostLogoutRedirectUris().forEach(redirectUri -> postLogoutRedirectUris.add(redirectUri.getValue()));
                    result.put("postLogoutRedirectUris", postLogoutRedirectUris);
                }
                if (oAuthRPExtensions.getDefaultAcrValues().size() > 0){
                    List<String> defaultAcrValues = new ArrayList<>();
                    oAuthRPExtensions.getDefaultAcrValues().forEach(acrValue -> defaultAcrValues.add(acrValue.getValue()));
                    result.put("defaultAcrValues", defaultAcrValues);
                }
                if (oAuthRPExtensions.getAudiences().size() > 0){
                    List<String> audiences = new ArrayList<>();
                    oAuthRPExtensions.getAudiences().forEach(aud -> audiences.add(aud.getURI()));
                    result.put("audiences", audiences);
                }
            }
        }
        return result;
    }

    @Override
    public EntityDescriptorRepresentation changeApproveStatusOfEntityDescriptor(String resourceId, boolean status) throws PersistentEntityNotFound, ForbiddenException {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            throw new PersistentEntityNotFound("Entity with resourceid[" + resourceId + "] was not found for approval");
        }
        if (status) { // approve
            int approvedCount = ed.approvedCount();
            List<Approvers> approversList = groupService.find(ed.getIdOfOwner()).getApproversList();
            if (!approversList.isEmpty() && approversList.size() > approvedCount) {
                Approvers approvers = approversList.get(
                                approvedCount); // yea for index zero - use the count to get the next approvers
                if (!userService.currentUserCanApprove(approvers.getApproverGroups())) {
                    throw new ForbiddenException("You do not have the permissions necessary to approve this entity descriptor.");
                }
                ed.addApproval(userService.getCurrentUserGroup());
                Group ownerGroup = groupService.find(ed.getIdOfOwner());
                ed.setApproved(ed.approvedCount() == ownerGroup.getApproversList().size()); // safe check in case of weird race conditions from the UI
                ed = entityDescriptorRepository.save(ed);
            }
        } else { // un-approve
            ed.removeLastApproval();
            Group ownerGroup = groupService.find(ed.getIdOfOwner());
            ed.setApproved(ed.approvedCount() == ownerGroup.getApproversList().size()); // safe check in case of weird race conditions from the UI
            ed = entityDescriptorRepository.save(ed);
        }
        return createRepresentationFromDescriptor(ed);
    }

    @Override
    public EntityDescriptor createDescriptorFromRepresentation(final EntityDescriptorRepresentation representation) {
        EntityDescriptor ed = openSamlObjects.buildDefaultInstanceOfType(EntityDescriptor.class);
        return buildDescriptorFromRepresentation(ed, representation);
    }

    @Override
    public EntityDescriptorRepresentation createNew(EntityDescriptor ed) throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException {
        return createNew(createRepresentationFromDescriptor(ed));
    }

    @Override
    public EntityDescriptorRepresentation createNew(EntityDescriptorRepresentation edRep) throws ForbiddenException, ObjectIdExistsException, InvalidPatternMatchException {
        if (edRep.isServiceEnabled() && !userService.currentUserIsAdmin()) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service.");
        }

        if (entityDescriptorRepository.findByEntityID(edRep.getEntityId()) != null) {
            throw new ObjectIdExistsException(edRep.getEntityId());
        }

        // "Create new" will use the current user's group as the owner
        String ownerId = userService.getCurrentUserGroup().getOwnerId();
        edRep.setIdOfOwner(ownerId);
        validateEntityIdAndACSUrls(edRep);

        EntityDescriptor ed = (EntityDescriptor) createDescriptorFromRepresentation(edRep);
        ed.setIdOfOwner(userService.getCurrentUserGroup().getOwnerId());

        ownershipRepository.deleteEntriesForOwnedObject(ed);
        ownershipRepository.save(new Ownership(userService.getCurrentUserGroup(), ed));

        return createRepresentationFromDescriptor(entityDescriptorRepository.save(ed));
    }

    @Override
    public EntityDescriptorRepresentation createNewEntityDescriptorFromXMLOrigin(EntityDescriptor ed) {
        ed.setIdOfOwner(userService.getCurrentUserGroup().getOwnerId());
        ownershipRepository.deleteEntriesForOwnedObject(ed);
        ownershipRepository.save(new Ownership(userService.getCurrentUserGroup(), ed));
        ed.setProtocol(determineEntityDescriptorProtocol(ed));
        if (ed.getProtocol() == EntityDescriptorProtocol.OIDC) {
            ed.getSPSSODescriptor("").addSupportedProtocol("http://openid.net/specs/openid-connect-core-1_0.html");
        }
        EntityDescriptor savedEntity = entityDescriptorRepository.save(ed);
        return createRepresentationFromDescriptor(savedEntity);
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
        representation.setProtocol(ed.getProtocol());
        representation.setApproved(isEntityDescriptorApproved(ed));

        // Set up SPSSODescriptor
        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getSupportedProtocols().size() > 0) {
            ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptorRepresentation = representation.getServiceProviderSsoDescriptor(true);
            serviceProviderSsoDescriptorRepresentation.setProtocolSupportEnum(String.join(",", ed.getSPSSODescriptor("").getSupportedProtocols().stream().map(p -> MDDCConstants.PROTOCOL_BINDINGS.get(p)).collect(Collectors.toList())));
        }

        if (ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").getNameIDFormats().size() > 0) {
            ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptorRepresentation = representation.getServiceProviderSsoDescriptor(true);
            serviceProviderSsoDescriptorRepresentation.setNameIdFormats(
                            ed.getSPSSODescriptor("").getNameIDFormats().stream().map(p -> p.getURI()).collect(Collectors.toList())
            );
        }

        if (ed.isOidcProtocol()) {
            ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptorRepresentation = representation.getServiceProviderSsoDescriptor(true);
            serviceProviderSsoDescriptorRepresentation.addExtensions("OAuthRPExtensions", buildOAuthRPExtensionsMap(ed));
        }

        if (ed.getOrganization() != null) {
            // set up organization
            OrganizationRepresentation organizationRepresentation = new OrganizationRepresentation();
            organizationRepresentation.setName(ed.getOrganization().getOrganizationNames().get(0).getValue());
            organizationRepresentation.setDisplayName(ed.getOrganization().getDisplayNames().get(0).getValue());
            organizationRepresentation.setUrl(ed.getOrganization().getURLs().get(0).getURI());
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
                    contactRepresentation.setName(contactPerson.getGivenName().getValue());
                }
                if (contactPerson.getEmailAddresses() != null && contactPerson.getEmailAddresses().size() > 0) {
                    contactRepresentation.setEmailAddress(contactPerson.getEmailAddresses().get(0).getURI());
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
                mduiRepresentation.setInformationUrl(uiInfo.getInformationURLs().get(0).getURI());
            }
            if (uiInfo.getPrivacyStatementURLs().size() > 0) {
                mduiRepresentation.setPrivacyStatementUrl(uiInfo.getPrivacyStatementURLs().get(0).getURI());
            }
            if (uiInfo.getDescriptions().size() > 0) {
                mduiRepresentation.setDescription(uiInfo.getDescriptions().get(0).getValue());
            }
            if (uiInfo.getLogos().size() > 0) {
                org.opensaml.saml.ext.saml2mdui.Logo logo = uiInfo.getLogos().get(0);
                mduiRepresentation.setLogoUrl(logo.getURI());
                mduiRepresentation.setLogoHeight(logo.getHeight());
                mduiRepresentation.setLogoWidth(logo.getWidth());
            }
        }

        setupSecurityRepresentationFromEntityDescriptor(ed, representation);

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
                                throw new RuntimeException("Multiple/No values detected where one is expected for override: " + jpaAttribute.getName());
                            }
                            attributeValues = ModelRepresentationConversions.getValueFromXMLObject(jpaAttribute.getAttributeValues().get(0));
                            break;
                        case INTEGER:
                            if (jpaAttribute.getAttributeValues().size() != 1) {
                                throw new RuntimeException("Multiple/No values detected where one is expected for override: " + jpaAttribute.getName());
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
    public void delete(String resourceId) throws ForbiddenException, PersistentEntityNotFound {
        EntityDescriptor ed = getEntityDescriptorByResourceId(resourceId);
        if (ed.isServiceEnabled()) {
            throw new ForbiddenException("Deleting an enabled Metadata Source is not allowed. Disable the source and try again.");
        }
        ownershipRepository.deleteEntriesForOwnedObject(ed);
        entityDescriptorRepository.delete(ed);

    }

    private EntityDescriptorProtocol determineEntityDescriptorProtocol(EntityDescriptor ed) {
        boolean oidcType = ed.getSPSSODescriptor("") != null && ed.getSPSSODescriptor("").isOidcType();
        return oidcType ? EntityDescriptorProtocol.OIDC : EntityDescriptorProtocol.SAML;
    }

    private KeyDescriptorRepresentation.ElementType determineKeyInfoType(KeyInfo keyInfo) {
        List<XMLObject> children = keyInfo.getOrderedChildren().stream().filter(xmlObj -> {
            boolean xmlWeDoNotWant = xmlObj instanceof KeyName || xmlObj instanceof KeyValue || xmlObj == null;
            return !xmlWeDoNotWant;
        }).collect(Collectors.toList());
        if (children.size() < 1) {
            return KeyDescriptorRepresentation.ElementType.unsupported;
        }
        XMLObject xmlObject = children.get(0);
        switch (xmlObject.getElementQName().getLocalPart()) {
        case "X509Data":
            return KeyDescriptorRepresentation.ElementType.X509Data;
        case "ClientSecret":
            return KeyDescriptorRepresentation.ElementType.clientSecret;
        case "ClientSecretKeyReference":
            return KeyDescriptorRepresentation.ElementType.clientSecretRef;
        case "JwksData":
            return KeyDescriptorRepresentation.ElementType.jwksData;
        case "JwksUri":
            return KeyDescriptorRepresentation.ElementType.jwksUri;
        default:
            return KeyDescriptorRepresentation.ElementType.unsupported;
        }
    }

    @Override
    public boolean entityExists(String entityID) {
        return entityDescriptorRepository.findByEntityID(entityID) != null ;
    }

    @Override
    public Iterable<EntityDescriptorRepresentation> getAllDisabledAndNotOwnedByAdmin() throws ForbiddenException {
        if (!userService.currentUserIsAdmin()) {
            throw new ForbiddenException();
        }
        return entityDescriptorRepository.findAllDisabledAndNotOwnedByAdmin().map(ed -> createRepresentationFromDescriptor(ed)).collect(Collectors.toList());
    }

    /**
     * Get the "short" detail list of entity descriptors that match the current user's group. The intent is the list will be those
     * EDs that the user would see on the dashboard.
     * @throws ForbiddenException
     */
    @Override
    public List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsBasedOnUserAccess() throws ForbiddenException {
        switch (userService.getCurrentUserAccess()) {
        case ADMIN:
            List<EntityDescriptorProjection> o = entityDescriptorRepository.findAllReturnProjections();
            return o;
        case GROUP:
            User user = userService.getCurrentUser();
            Group group = user.getGroup();
            List<EntityDescriptorProjection> ed =  entityDescriptorRepository.findAllByIdOfOwner(group.getOwnerId());
            return ed;
        default:
            throw new ForbiddenException();
        }
    }

    /**
     * Based on the current users group, find those entities that the user can approve that need approval
     */
    @Override
    public List<EntityDescriptorProjection> getAllEntityDescriptorProjectionsNeedingApprovalBasedOnUserAccess() {
        List<String> groupsToApprove = userService.getGroupsCurrentUserCanApprove();
        List<EntityDescriptorProjection> result = entityDescriptorRepository.getEntityDescriptorsNeedingApproval(groupsToApprove);
        return result;
    }

    @Override
    public List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList) {
        if (attributeList == null) {
            return new ArrayList<>();
        }
        attributeList.removeIf(Objects::isNull);
        return ModelRepresentationConversions.getAttributeReleaseListFromAttributeList(attributeList);
    }

    @Override
    public EntityDescriptor getEntityDescriptorByResourceId(String resourceId) throws PersistentEntityNotFound, ForbiddenException {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            throw new PersistentEntityNotFound(String.format("The entity descriptor with entity id [%s] was not found.", resourceId));
        }
        if (!userService.canViewOrEditTarget(ed)) {
            throw new ForbiddenException();
        }
        return ed;
    }

    @Override
    public Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList) {
        return ModelRepresentationConversions.getRelyingPartyOverridesRepresentationFromAttributeList(attributeList);
    }

    private boolean isEntityDescriptorApproved(EntityDescriptor ed) {
        if (ed.isServiceEnabled()) {
            return true;
        }
        Group ownerGroup = groupService.find(ed.getIdOfOwner());
        if (ownerGroup == null) {
            ownerGroup = Group.ADMIN_GROUP; // This should only happen in the large number of tests that were written prior to group implementation
        }
        return ed.approvedCount() >= ownerGroup.getApproversList().size();
    }

    private void setupSecurityRepresentationFromEntityDescriptor(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        SecurityInfoRepresentation securityInfoRepresentation = representation.getSecurityInfo();
        if (ed.wantsAssertionsSigned()) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }
            securityInfoRepresentation.setWantAssertionsSigned(true);
        }
        if (ed.isAuthnRequestsSigned()) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }
            securityInfoRepresentation.setAuthenticationRequestsSigned(true);
        }

        // If the EntityDescriptor has key descriptors - parse them out.
        if (ed.hasKeyDescriptors()) {
            if (securityInfoRepresentation == null) {
                securityInfoRepresentation = new SecurityInfoRepresentation();
                representation.setSecurityInfo(securityInfoRepresentation);
            }

            for (org.opensaml.saml.saml2.metadata.KeyDescriptor keyDescriptor : ed.getSPSSODescriptor("").getKeyDescriptors()) {
                KeyDescriptorRepresentation keyDescriptorRep = new KeyDescriptorRepresentation();
                String name = keyDescriptor.getKeyInfo().getKeyNames().size() > 0 ? keyDescriptor.getKeyInfo().getKeyNames().get(0).getValue() : null;
                name = name == null ? ((KeyDescriptor)keyDescriptor).getName() : name;
                keyDescriptorRep.setName(name);

                //TODO: check this. assume that if no value is set, it's used for both
                String useType = keyDescriptor.getUse() != null ? keyDescriptor.getUse().toString().toLowerCase() : "both";
                keyDescriptorRep.setType(useType);

                KeyInfo keyInfo = keyDescriptor.getKeyInfo();
                KeyDescriptorRepresentation.ElementType keyInfoType = determineKeyInfoType(keyInfo);
                keyDescriptorRep.setElementType(keyInfoType);
                if (keyInfoType != KeyDescriptorRepresentation.ElementType.unsupported) {
                    List<XMLObject> children = keyInfo.getOrderedChildren().stream().filter(xmlObj -> {
                        boolean xmlWeDoNotWant = xmlObj instanceof KeyName || xmlObj instanceof KeyValue || xmlObj == null;
                        return !xmlWeDoNotWant;
                    }).collect(Collectors.toList());
                    XMLObject obj = children.get(0);
                    if (keyInfoType == KeyDescriptorRepresentation.ElementType.X509Data) {
                        obj = ((X509Data) obj).getX509Certificates().get(0);
                    }
                    keyDescriptorRep.setValue(((ValueXMLObject) obj).getValue());
                    securityInfoRepresentation.addKeyDescriptor(keyDescriptorRep);
                }
            }
        }
    }

    @Override
    public EntityDescriptorRepresentation update(EntityDescriptorRepresentation edRep) throws ForbiddenException, PersistentEntityNotFound, InvalidPatternMatchException {
        EntityDescriptor existingEd = entityDescriptorRepository.findByResourceId(edRep.getId());
        if (existingEd == null) {
            throw new PersistentEntityNotFound(String.format("The entity descriptor with entity id [%s] was not found for update.", edRep.getId()));
        }
        if (edRep.isServiceEnabled() && !userService.currentUserCanEnable(existingEd)) {
            throw new ForbiddenException("You do not have the permissions necessary to enable this service.");
        }
        if (StringUtils.isEmpty(edRep.getIdOfOwner())) {
            edRep.setIdOfOwner(StringUtils.isNotEmpty(existingEd.getIdOfOwner()) ? existingEd.getIdOfOwner() :  userService.getCurrentUserGroup().getOwnerId());
        }
        if (!userService.canViewOrEditTarget(existingEd)) {
            throw new ForbiddenException();
        }
        // Verify we're the only one attempting to update the EntityDescriptor
        if (edRep.getVersion() != existingEd.hashCode()) {
            throw new ConcurrentModificationException(String.format("A concurrent modification has occured on entity descriptor with entity id [%s]. Please refresh and try again", edRep.getId()));
        }

        validateEntityIdAndACSUrls(edRep);
        updateDescriptorFromRepresentation(existingEd, edRep);
        existingEd = entityDescriptorRepository.save(existingEd);
        ownershipRepository.deleteEntriesForOwnedObject(existingEd);
        ownershipRepository.save(new Ownership(new Owner() {
            public String getOwnerId() { return edRep.getIdOfOwner(); }
            public OwnerType getOwnerType() { return OwnerType.GROUP; }
        }, existingEd));
        return createRepresentationFromDescriptor(existingEd);
    }

    @Override
    // This should be private, but we use it in a couple different test classes not sure we should keep...
    public void updateDescriptorFromRepresentation(org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor, EntityDescriptorRepresentation representation) {
        if (!(entityDescriptor instanceof EntityDescriptor)) {
            throw new UnsupportedOperationException("not yet implemented");
        }
        buildDescriptorFromRepresentation((EntityDescriptor) entityDescriptor, representation);
    }

    @Override
    public EntityDescriptorRepresentation updateEntityDescriptorEnabledStatus(String resourceId, boolean status) throws PersistentEntityNotFound, ForbiddenException {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        if (ed == null) {
            throw new PersistentEntityNotFound("Entity with resourceid[" + resourceId + "] was not found for update");
        }
        if (!userService.currentUserCanEnable(ed)) {
            throw new ForbiddenException("You do not have the permissions necessary to change the enable status of this entity descriptor.");
        }
        // check to see if approvals have been completed
        int approvedCount = ed.approvedCount();
        List<Approvers> approversList = groupService.find(ed.getIdOfOwner()).getApproversList();
        if (status == true && !ed.isServiceEnabled() && !userService.currentUserIsAdmin() && approversList.size() > approvedCount) {
            throw new ForbiddenException("Approval must be completed before you can change the enable status of this entity descriptor.");
        }
        ed.setServiceEnabled(status);
        if (status == true) {
            ed.setApproved(true);
        }
        ed = entityDescriptorRepository.save(ed);
        return createRepresentationFromDescriptor(ed);
    }

    @Override
    public EntityDescriptorRepresentation updateGroupForEntityDescriptor(String resourceId, String groupId) {
        EntityDescriptor ed = entityDescriptorRepository.findByResourceId(resourceId);
        ed.setIdOfOwner(groupId);
        ownershipRepository.deleteEntriesForOwnedObject(ed);
        ownershipRepository.save(new Ownership(groupService.find(groupId), ed));
        EntityDescriptor savedEntity = entityDescriptorRepository.save(ed);
        return createRepresentationFromDescriptor(savedEntity);
    }

    private void validateEntityIdAndACSUrls(EntityDescriptorRepresentation edRep) throws InvalidPatternMatchException {
        // Check the entity id first
        if (!groupService.doesStringMatchGroupPattern(edRep.getIdOfOwner(), edRep.getEntityId())) {
            throw new InvalidPatternMatchException("EntityId is not a pattern match to the group");
        }

        // Check the ACS locations
        if (edRep.getAssertionConsumerServices() != null && edRep.getAssertionConsumerServices().size() > 0) {
            for (AssertionConsumerServiceRepresentation acs : edRep.getAssertionConsumerServices()) {
                if (!groupService.doesStringMatchGroupPattern(edRep.getIdOfOwner(), acs.getLocationUrl())) {
                    throw new InvalidPatternMatchException(
                                    "ACS location [ " + acs.getLocationUrl() + " ] is not a pattern match to the group");
                }
            }
        }
    }
}