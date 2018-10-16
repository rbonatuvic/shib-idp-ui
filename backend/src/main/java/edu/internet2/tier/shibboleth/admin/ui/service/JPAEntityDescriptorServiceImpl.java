package edu.internet2.tier.shibboleth.admin.ui.service;


import com.google.common.base.Strings;
import edu.internet2.tier.shibboleth.admin.ui.domain.AssertionConsumerService;
import edu.internet2.tier.shibboleth.admin.ui.domain.Attribute;
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeBuilder;
import edu.internet2.tier.shibboleth.admin.ui.domain.AttributeValue;
import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPerson;
import edu.internet2.tier.shibboleth.admin.ui.domain.ContactPersonBuilder;
import edu.internet2.tier.shibboleth.admin.ui.domain.Description;
import edu.internet2.tier.shibboleth.admin.ui.domain.DisplayName;
import edu.internet2.tier.shibboleth.admin.ui.domain.EmailAddress;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributes;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityAttributesBuilder;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.Extensions;
import edu.internet2.tier.shibboleth.admin.ui.domain.GivenName;
import edu.internet2.tier.shibboleth.admin.ui.domain.InformationURL;
import edu.internet2.tier.shibboleth.admin.ui.domain.KeyDescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.Logo;
import edu.internet2.tier.shibboleth.admin.ui.domain.NameIDFormat;
import edu.internet2.tier.shibboleth.admin.ui.domain.Organization;
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationDisplayName;
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationName;
import edu.internet2.tier.shibboleth.admin.ui.domain.OrganizationURL;
import edu.internet2.tier.shibboleth.admin.ui.domain.PrivacyStatementURL;
import edu.internet2.tier.shibboleth.admin.ui.domain.RelyingPartyOverrideProperty;
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.SingleLogoutService;
import edu.internet2.tier.shibboleth.admin.ui.domain.UIInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSAny;
import edu.internet2.tier.shibboleth.admin.ui.domain.XSBoolean;

import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ServiceProviderSsoDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.util.MDDCConstants;
import edu.internet2.tier.shibboleth.admin.util.ModelRepresentationConversions;

import org.opensaml.core.xml.schema.XSBooleanValue;
import org.opensaml.xmlsec.signature.KeyInfo;
import org.opensaml.xmlsec.signature.X509Certificate;
import org.opensaml.xmlsec.signature.X509Data;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Default implementation of {@link EntityDescriptorService}
 *
 * @since 1.0
 */
public class JPAEntityDescriptorServiceImpl implements EntityDescriptorService {

    private static final Logger LOGGER = LoggerFactory.getLogger(JPAEntityDescriptorServiceImpl.class);

    @Autowired
    private OpenSamlObjects openSamlObjects;

    @Autowired
    private EntityService entityService;

    public JPAEntityDescriptorServiceImpl(OpenSamlObjects openSamlObjects, EntityService entityService) {
        this.openSamlObjects = openSamlObjects;
        this.entityService = entityService;
    }

    @Override
    public EntityDescriptor createDescriptorFromRepresentation(final EntityDescriptorRepresentation representation) {
        EntityDescriptor ed = openSamlObjects.buildDefaultInstanceOfType(EntityDescriptor.class);
        ed.setEntityID(representation.getEntityId());

        // setup SPSSODescriptor
        if (representation.getServiceProviderSsoDescriptor() != null) {
            SPSSODescriptor spssoDescriptor = getSPSSODescriptorFromEntityDescriptor(ed);

            if (!Strings.isNullOrEmpty(representation.getServiceProviderSsoDescriptor().getProtocolSupportEnum())) {
                spssoDescriptor.setSupportedProtocols(
                        Arrays.stream(representation.getServiceProviderSsoDescriptor().getProtocolSupportEnum().split(",")).map(p -> MDDCConstants.PROTOCOL_BINDINGS.get(p.trim())).collect(Collectors.toList())
                );
            }


            if (representation.getServiceProviderSsoDescriptor() != null && representation.getServiceProviderSsoDescriptor().getNameIdFormats() != null && representation.getServiceProviderSsoDescriptor().getNameIdFormats().size() > 0) {
                for (String nameidFormat : representation.getServiceProviderSsoDescriptor().getNameIdFormats()) {
                    NameIDFormat nameIDFormat = openSamlObjects.buildDefaultInstanceOfType(NameIDFormat.class);

                    nameIDFormat.setFormat(nameidFormat);

                    spssoDescriptor.getNameIDFormats().add(nameIDFormat);
                }
            }
        }

        ed.setServiceProviderName(representation.getServiceProviderName());
        ed.setServiceEnabled(representation.isServiceEnabled());

        // set up organization
        if (representation.getOrganization() != null && representation.getOrganization().getName() != null && representation.getOrganization().getDisplayName() != null && representation.getOrganization().getUrl() != null) {
            OrganizationRepresentation organizationRepresentation = representation.getOrganization();
            Organization organization = openSamlObjects.buildDefaultInstanceOfType(Organization.class);

            OrganizationName organizationName = openSamlObjects.buildDefaultInstanceOfType(OrganizationName.class);
            organizationName.setXMLLang("en");
            organizationName.setValue(organizationRepresentation.getName());
            organization.getOrganizationNames().add(organizationName);

            OrganizationDisplayName organizationDisplayName = openSamlObjects.buildDefaultInstanceOfType(OrganizationDisplayName.class);
            organizationDisplayName.setXMLLang("en");
            organizationDisplayName.setValue(organizationRepresentation.getDisplayName());
            organization.getDisplayNames().add(organizationDisplayName);

            OrganizationURL organizationURL = openSamlObjects.buildDefaultInstanceOfType(OrganizationURL.class);
            organizationURL.setXMLLang("en");
            organizationURL.setValue(organizationRepresentation.getUrl());
            organization.getURLs().add(organizationURL);

            ed.setOrganization(organization);
        }

        // set up contacts
        if (representation.getContacts() != null && representation.getContacts().size() > 0) {
            for (ContactRepresentation contactRepresentation : representation.getContacts()) {
                ContactPerson contactPerson = ((ContactPersonBuilder) openSamlObjects.getBuilderFactory().getBuilder(ContactPerson.DEFAULT_ELEMENT_NAME)).buildObject();

                contactPerson.setType(contactRepresentation.getType());

                GivenName givenName = openSamlObjects.buildDefaultInstanceOfType(GivenName.class);
                givenName.setName(contactRepresentation.getName());
                contactPerson.setGivenName(givenName);

                EmailAddress emailAddress = openSamlObjects.buildDefaultInstanceOfType(EmailAddress.class);
                emailAddress.setAddress(contactRepresentation.getEmailAddress());
                contactPerson.addEmailAddress(emailAddress);

                ed.addContactPerson(contactPerson);
            }
        }

        // set up mdui
        if (representation.getMdui() != null) {
            MduiRepresentation mduiRepresentation = representation.getMdui();

            if (!Strings.isNullOrEmpty(mduiRepresentation.getDisplayName())) {
                DisplayName displayName = openSamlObjects.buildDefaultInstanceOfType(DisplayName.class);
                getUIInfo(ed).addDisplayName(displayName);
                displayName.setValue(mduiRepresentation.getDisplayName());
                displayName.setXMLLang("en");
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getInformationUrl())) {
                InformationURL informationURL = openSamlObjects.buildDefaultInstanceOfType(InformationURL.class);
                getUIInfo(ed).addInformationURL(informationURL);
                informationURL.setValue(mduiRepresentation.getInformationUrl());
                informationURL.setXMLLang("en");
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getPrivacyStatementUrl())) {
                PrivacyStatementURL privacyStatementURL = openSamlObjects.buildDefaultInstanceOfType(PrivacyStatementURL.class);
                getUIInfo(ed).addPrivacyStatementURL(privacyStatementURL);
                privacyStatementURL.setValue(mduiRepresentation.getPrivacyStatementUrl());
                privacyStatementURL.setXMLLang("en");
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getDescription())) {
                Description description = openSamlObjects.buildDefaultInstanceOfType(Description.class);
                getUIInfo(ed).addDescription(description);
                description.setValue(mduiRepresentation.getDescription());
                description.setXMLLang("en");
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getLogoUrl())) {
                Logo logo = openSamlObjects.buildDefaultInstanceOfType(Logo.class);
                getUIInfo(ed).addLog(logo);
                logo.setURL(mduiRepresentation.getLogoUrl());
                logo.setHeight(mduiRepresentation.getLogoHeight());
                logo.setWidth(mduiRepresentation.getLogoWidth());
                logo.setXMLLang("en");
            }
        }

        // setup security
        if (representation.getSecurityInfo() != null) {
            SecurityInfoRepresentation securityInfoRepresentation = representation.getSecurityInfo();
            if (securityInfoRepresentation.isAuthenticationRequestsSigned()) {
                getSPSSODescriptorFromEntityDescriptor(ed).setAuthnRequestsSigned(true);
            }
            if (securityInfoRepresentation.isWantAssertionsSigned()) {
                getSPSSODescriptorFromEntityDescriptor(ed).setWantAssertionsSigned(true);
            }
            if (securityInfoRepresentation.isX509CertificateAvailable()) {
                for (SecurityInfoRepresentation.X509CertificateRepresentation x509CertificateRepresentation : securityInfoRepresentation.getX509Certificates()) {
                    KeyDescriptor keyDescriptor = createKeyDescriptor(x509CertificateRepresentation.getName(), x509CertificateRepresentation.getType(), x509CertificateRepresentation.getValue());
                    getSPSSODescriptorFromEntityDescriptor(ed).addKeyDescriptor(keyDescriptor);
                }
            }
        }

        // setup ACSs
        if (representation.getAssertionConsumerServices() != null && representation.getAssertionConsumerServices().size() > 0) {
            for (AssertionConsumerServiceRepresentation acsRepresentation : representation.getAssertionConsumerServices()) {
                AssertionConsumerService assertionConsumerService = openSamlObjects.buildDefaultInstanceOfType(AssertionConsumerService.class);
                getSPSSODescriptorFromEntityDescriptor(ed).getAssertionConsumerServices().add(assertionConsumerService);
                if (acsRepresentation.isMakeDefault()) {
                    assertionConsumerService.setIsDefault(true);
                }
                assertionConsumerService.setBinding(acsRepresentation.getBinding());
                assertionConsumerService.setLocation(acsRepresentation.getLocationUrl());
            }
        }

        // setup logout
        if (representation.getLogoutEndpoints() != null && !representation.getLogoutEndpoints().isEmpty()) {
            for (LogoutEndpointRepresentation logoutEndpointRepresentation : representation.getLogoutEndpoints()) {
                SingleLogoutService singleLogoutService = openSamlObjects.buildDefaultInstanceOfType(SingleLogoutService.class);
                singleLogoutService.setBinding(logoutEndpointRepresentation.getBindingType());
                singleLogoutService.setLocation(logoutEndpointRepresentation.getUrl());

                getSPSSODescriptorFromEntityDescriptor(ed).getSingleLogoutServices().add(singleLogoutService);
            }
        }

        if (representation.getRelyingPartyOverrides() != null || (representation.getAttributeRelease() != null && representation.getAttributeRelease().size() > 0)) {
            getEntityAttributes(ed).getAttributes().addAll(entityService.getAttributeListFromEntityRepresentation(representation));
        }
        return ed;
    }

    private SPSSODescriptor getSPSSODescriptorFromEntityDescriptor(EntityDescriptor entityDescriptor) {
        if (entityDescriptor.getSPSSODescriptor("") == null) {
            SPSSODescriptor spssoDescriptor = openSamlObjects.buildDefaultInstanceOfType(SPSSODescriptor.class);
            entityDescriptor.getRoleDescriptors().add(spssoDescriptor);
        }
        return entityDescriptor.getSPSSODescriptor("");
    }

    private Attribute createAttributeWithBooleanValue(String name, String friendlyName, Boolean value) {
        Attribute attribute = ((AttributeBuilder) openSamlObjects.getBuilderFactory().getBuilder(Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        attribute.setFriendlyName(friendlyName);
        attribute.setNameFormat("urn:oasis:names:tc:SAML:2.0:attrname-format:uri");

        XSBoolean xsBoolean = (XSBoolean) openSamlObjects.getBuilderFactory().getBuilder(XSBoolean.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME, XSBoolean.TYPE_NAME);
        xsBoolean.setValue(XSBooleanValue.valueOf(value.toString()));

        attribute.getAttributeValues().add(xsBoolean);
        return attribute;
    }

    private Attribute createAttributeWithArbitraryValues(String name, String friendlyName, String... values) {
        Attribute attribute = ((AttributeBuilder) openSamlObjects.getBuilderFactory().getBuilder(Attribute.DEFAULT_ELEMENT_NAME)).buildObject();
        attribute.setName(name);
        attribute.setFriendlyName(friendlyName);
        attribute.setNameFormat("urn:oasis:names:tc:SAML:2.0:attrname-format:uri");

        for (String value : values) {
            XSAny xsAny = (XSAny) openSamlObjects.getBuilderFactory().getBuilder(XSAny.TYPE_NAME).buildObject(AttributeValue.DEFAULT_ELEMENT_NAME);
            xsAny.setTextContent(value);
            attribute.getAttributeValues().add(xsAny);
        }

        return attribute;
    }

    private Attribute createAttributeWithArbitraryValues(String name, String friendlyName, List<String> values) {
        return createAttributeWithArbitraryValues(name, friendlyName, values.toArray(new String[]{}));
    }

    private KeyDescriptor createKeyDescriptor(String name, String type, String value) {
        KeyDescriptor keyDescriptor = openSamlObjects.buildDefaultInstanceOfType(KeyDescriptor.class);

        if (!Strings.isNullOrEmpty(name)) {
            keyDescriptor.setName(name);
        }

        if (!"both".equals(type)) {
            keyDescriptor.setUsageType(type);
        }

        KeyInfo keyInfo = openSamlObjects.buildDefaultInstanceOfType(KeyInfo.class);
        keyDescriptor.setKeyInfo(keyInfo);

        X509Data x509Data = openSamlObjects.buildDefaultInstanceOfType(X509Data.class);
        keyInfo.getXMLObjects().add(x509Data);

        X509Certificate x509Certificate = openSamlObjects.buildDefaultInstanceOfType(X509Certificate.class);
        x509Data.getXMLObjects().add(x509Certificate);
        x509Certificate.setValue(value);

        return keyDescriptor;
    }

    private EntityAttributes getEntityAttributes(EntityDescriptor ed) {
        Extensions extensions = ed.getExtensions();
        if (extensions == null) {
            extensions = openSamlObjects.buildDefaultInstanceOfType(Extensions.class);
            ed.setExtensions(extensions);
        }

        EntityAttributes entityAttributes;
        if (extensions.getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).size() > 0) {
            entityAttributes = (EntityAttributes) extensions.getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).get(0);
        } else {
            entityAttributes = ((EntityAttributesBuilder) openSamlObjects.getBuilderFactory().getBuilder(EntityAttributes.DEFAULT_ELEMENT_NAME)).buildObject();
            extensions.getUnknownXMLObjects().add(entityAttributes);
        }
        return entityAttributes;
    }

    private UIInfo getUIInfo(EntityDescriptor ed) {
        Extensions extensions = getSPSSODescriptorFromEntityDescriptor(ed).getExtensions();
        if (extensions == null) {
            extensions = openSamlObjects.buildDefaultInstanceOfType(Extensions.class);
            ed.getSPSSODescriptor("").setExtensions(extensions);
        }

        UIInfo uiInfo;
        if (extensions.getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).size() > 0) {
            uiInfo = (UIInfo) extensions.getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).get(0);
        } else {
            uiInfo = openSamlObjects.buildDefaultInstanceOfType(UIInfo.class);
            extensions.getUnknownXMLObjects().add(uiInfo);
        }
        return uiInfo;
    }

    //TODO: implement
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

                Optional override = ModelRepresentationConversions.getOverrideByAttributeName(jpaAttribute.getName());
                if (override.isPresent()) {
                    relyingPartyOverrides.put(((RelyingPartyOverrideProperty)override.get()).getName(),
                                              jpaAttribute.getAttributeValues());
                }
            }

            representation.setRelyingPartyOverrides(relyingPartyOverrides);
        }

        return representation;
    }

    @Override
    public List<String> getAttributeReleaseListFromAttributeList(List<Attribute> attributeList) {
        return ModelRepresentationConversions.getAttributeReleaseListFromAttributeList(attributeList);
    }

    @Override
    public Map<String, Object> getRelyingPartyOverridesRepresentationFromAttributeList(List<Attribute> attributeList) {
        return ModelRepresentationConversions.getRelyingPartyOverridesRepresentationFromAttributeList(attributeList);
    }



    @Override
    public void updateDescriptorFromRepresentation(org.opensaml.saml.saml2.metadata.EntityDescriptor entityDescriptor, EntityDescriptorRepresentation representation) {
        // TODO: implement
        throw new UnsupportedOperationException("not yet implemented");
    }
}
