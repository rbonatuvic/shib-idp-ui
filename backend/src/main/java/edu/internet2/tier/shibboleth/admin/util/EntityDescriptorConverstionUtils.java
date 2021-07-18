package edu.internet2.tier.shibboleth.admin.util;

import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConverstionUtils.getEntityAttributes;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConverstionUtils.getOptionalEntityAttributes;
import static edu.internet2.tier.shibboleth.admin.util.EntityDescriptorConverstionUtils.getSPSSODescriptorFromEntityDescriptor;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

import org.opensaml.xmlsec.signature.KeyInfo;
import org.opensaml.xmlsec.signature.X509Certificate;
import org.opensaml.xmlsec.signature.X509Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.common.base.Strings;

import edu.internet2.tier.shibboleth.admin.ui.domain.AssertionConsumerService;
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
import edu.internet2.tier.shibboleth.admin.ui.domain.SPSSODescriptor;
import edu.internet2.tier.shibboleth.admin.ui.domain.SingleLogoutService;
import edu.internet2.tier.shibboleth.admin.ui.domain.UIInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.AssertionConsumerServiceRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.ContactRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.EntityDescriptorRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.LogoutEndpointRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.MduiRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.OrganizationRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.domain.frontend.SecurityInfoRepresentation;
import edu.internet2.tier.shibboleth.admin.ui.opensaml.OpenSamlObjects;
import edu.internet2.tier.shibboleth.admin.ui.service.EntityService;
import lombok.Setter;

@Service
public class EntityDescriptorConverstionUtils {
    @Autowired
    @Setter
    private static OpenSamlObjects openSamlObjects;
    
    @Autowired
    @Setter
    private static EntityService entityService;
    
    public static KeyDescriptor createKeyDescriptor(String name, String type, String value) {
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
    
    public static EntityAttributes getEntityAttributes(EntityDescriptor ed) {
        return getEntityAttributes(ed, true);
    }
    
    public static EntityAttributes getEntityAttributes(EntityDescriptor ed, boolean create) {
        Extensions extensions = ed.getExtensions();
        if (extensions == null && !create) {
            return null;
        }
        if (extensions == null) {
            extensions = openSamlObjects.buildDefaultInstanceOfType(Extensions.class);
            ed.setExtensions(extensions);
        }

        EntityAttributes entityAttributes = null;
        if (extensions.getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).size() > 0) {
            entityAttributes = (EntityAttributes) extensions.getUnknownXMLObjects(EntityAttributes.DEFAULT_ELEMENT_NAME).get(0);
        } else {
            if (create) {
                entityAttributes = ((EntityAttributesBuilder) openSamlObjects.getBuilderFactory().getBuilder(EntityAttributes.DEFAULT_ELEMENT_NAME)).buildObject();
                extensions.getUnknownXMLObjects().add(entityAttributes);
            }
        }
        return entityAttributes;
    }

    public static Optional<EntityAttributes> getOptionalEntityAttributes(EntityDescriptor ed) {
        return Optional.ofNullable(getEntityAttributes(ed, false));
    }
    
    public static SPSSODescriptor getSPSSODescriptorFromEntityDescriptor(EntityDescriptor entityDescriptor) {
        return getSPSSODescriptorFromEntityDescriptor(entityDescriptor, true);
    }
    
    public static SPSSODescriptor getSPSSODescriptorFromEntityDescriptor(EntityDescriptor entityDescriptor, boolean create) {
        if (entityDescriptor.getSPSSODescriptor("") == null && create) {
            SPSSODescriptor spssoDescriptor = openSamlObjects.buildDefaultInstanceOfType(SPSSODescriptor.class);
            entityDescriptor.getRoleDescriptors().add(spssoDescriptor);
        }
        return entityDescriptor.getSPSSODescriptor("");
    }
    
    private static UIInfo getUIInfo(EntityDescriptor ed) {
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
    
    private static void removeUIInfo(EntityDescriptor ed) {
        SPSSODescriptor spssoDescriptor = getSPSSODescriptorFromEntityDescriptor(ed, false);
        if (spssoDescriptor != null) {
            Extensions extensions = spssoDescriptor.getExtensions();
            if (extensions == null) {
                return;
            }
            if (extensions.getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).size() > 0) {
                extensions.getUnknownXMLObjects().remove(extensions.getUnknownXMLObjects(UIInfo.DEFAULT_ELEMENT_NAME).get(0));
            }
        }
    }
    
    public static void setupACSs(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getAssertionConsumerServices() != null && representation.getAssertionConsumerServices().size() > 0) {
            // TODO: review if we need more than a naive implementation
            ed.getOptionalSPSSODescriptor().ifPresent(spssoDescriptor -> spssoDescriptor.getAssertionConsumerServices().clear());
            for (AssertionConsumerServiceRepresentation acsRepresentation : representation.getAssertionConsumerServices()) {
                AssertionConsumerService assertionConsumerService = openSamlObjects.buildDefaultInstanceOfType(AssertionConsumerService.class);
                getSPSSODescriptorFromEntityDescriptor(ed).getAssertionConsumerServices().add(assertionConsumerService);
                if (acsRepresentation.isMakeDefault()) {
                    assertionConsumerService.setIsDefault(true);
                }
                assertionConsumerService.setBinding(acsRepresentation.getBinding());
                assertionConsumerService.setLocation(acsRepresentation.getLocationUrl());
                assertionConsumerService.setIndex(acsRepresentation.getIndex());
            }
        } else {
            ed.getOptionalSPSSODescriptor().ifPresent(spssoDescriptor -> spssoDescriptor.getAssertionConsumerServices().clear());
        }
    }
    
    public static void setupContacts(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getContacts() != null && representation.getContacts().size() > 0) {
            ed.getContactPersons().clear();
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
        } else {
            ed.getContactPersons().clear();
        }
    }
    
    public static void setupLogout(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        // setup logout
        if (representation.getLogoutEndpoints() != null && !representation.getLogoutEndpoints().isEmpty()) {
            // TODO: review if we need more than a naive implementation
            ed.getOptionalSPSSODescriptor().ifPresent(spssoDescriptor -> spssoDescriptor.getSingleLogoutServices().clear());
            for (LogoutEndpointRepresentation logoutEndpointRepresentation : representation.getLogoutEndpoints()) {
                SingleLogoutService singleLogoutService = openSamlObjects.buildDefaultInstanceOfType(SingleLogoutService.class);
                singleLogoutService.setBinding(logoutEndpointRepresentation.getBindingType());
                singleLogoutService.setLocation(logoutEndpointRepresentation.getUrl());

                getSPSSODescriptorFromEntityDescriptor(ed).getSingleLogoutServices().add(singleLogoutService);
            }
        } else {
            ed.getOptionalSPSSODescriptor().ifPresent(spssoDescriptor -> spssoDescriptor.getSingleLogoutServices().clear());
        }
    }

    public static void setupOrganization(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
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
        } else {
            ed.setOrganization(null);
        }
    }
    
    public static void setupSecurity(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getSecurityInfo() != null) {
            SecurityInfoRepresentation securityInfoRepresentation = representation.getSecurityInfo();
            if (securityInfoRepresentation.isAuthenticationRequestsSigned()) {
                getSPSSODescriptorFromEntityDescriptor(ed).setAuthnRequestsSigned(true);
            }
            if (securityInfoRepresentation.isWantAssertionsSigned()) {
                getSPSSODescriptorFromEntityDescriptor(ed).setWantAssertionsSigned(true);
            }
            // TODO: review if we need more than a naive implementation
            ed.getOptionalSPSSODescriptor().ifPresent( i -> i.getKeyDescriptors().clear());
            if (securityInfoRepresentation.isX509CertificateAvailable()) {
                for (SecurityInfoRepresentation.X509CertificateRepresentation x509CertificateRepresentation : securityInfoRepresentation.getX509Certificates()) {
                    KeyDescriptor keyDescriptor = createKeyDescriptor(x509CertificateRepresentation.getName(), x509CertificateRepresentation.getType(), x509CertificateRepresentation.getValue());
                    getSPSSODescriptorFromEntityDescriptor(ed).addKeyDescriptor(keyDescriptor);
                }
            }
        } else {
            ed.getOptionalSPSSODescriptor().ifPresent( spssoDescriptor -> {
                spssoDescriptor.setAuthnRequestsSigned((Boolean) null);
                spssoDescriptor.setWantAssertionsSigned((Boolean) null);
                spssoDescriptor.getKeyDescriptors().clear();
            });
        }
    }
    
    public static void setupSPSSODescriptor(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getServiceProviderSsoDescriptor() != null) {
            SPSSODescriptor spssoDescriptor = getSPSSODescriptorFromEntityDescriptor(ed);

            spssoDescriptor.setSupportedProtocols(Collections.EMPTY_LIST);
            if (!Strings.isNullOrEmpty(representation.getServiceProviderSsoDescriptor().getProtocolSupportEnum())) {
                spssoDescriptor.setSupportedProtocols(
                        Arrays.stream(representation.getServiceProviderSsoDescriptor().getProtocolSupportEnum().split(",")).map(p -> MDDCConstants.PROTOCOL_BINDINGS.get(p.trim())).collect(Collectors.toList())
                );
            }

            spssoDescriptor.getNameIDFormats().clear();
            if (representation.getServiceProviderSsoDescriptor() != null && representation.getServiceProviderSsoDescriptor().getNameIdFormats() != null && representation.getServiceProviderSsoDescriptor().getNameIdFormats().size() > 0) {
                for (String nameidFormat : representation.getServiceProviderSsoDescriptor().getNameIdFormats()) {
                    NameIDFormat nameIDFormat = openSamlObjects.buildDefaultInstanceOfType(NameIDFormat.class);

                    nameIDFormat.setFormat(nameidFormat);

                    spssoDescriptor.getNameIDFormats().add(nameIDFormat);
                }
            }
        } else {
            ed.setRoleDescriptors(null);
        }
    }
    
    public static void setupUIInfo(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getMdui() != null) {
            // TODO: check if we need more than a naive implementation
            removeUIInfo(ed);
            MduiRepresentation mduiRepresentation = representation.getMdui();

            if (!Strings.isNullOrEmpty(mduiRepresentation.getDisplayName())) {
                DisplayName displayName = openSamlObjects.buildDefaultInstanceOfType(DisplayName.class);
                getUIInfo(ed).addDisplayName(displayName);
                displayName.setValue(mduiRepresentation.getDisplayName());
                displayName.setXMLLang("en");
            } else {
                ed.getOptionalSPSSODescriptor()
                        .flatMap(SPSSODescriptor::getOptionalExtensions)
                        .flatMap(Extensions::getOptionalUIInfo)
                        .ifPresent(u -> u.getXMLObjects().removeAll(u.getDisplayNames()));
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getInformationUrl())) {
                InformationURL informationURL = openSamlObjects.buildDefaultInstanceOfType(InformationURL.class);
                getUIInfo(ed).addInformationURL(informationURL);
                informationURL.setValue(mduiRepresentation.getInformationUrl());
                informationURL.setXMLLang("en");
            } else {
                ed.getOptionalSPSSODescriptor()
                        .flatMap(SPSSODescriptor::getOptionalExtensions)
                        .flatMap(Extensions::getOptionalUIInfo)
                        .ifPresent(u -> u.getXMLObjects().removeAll(u.getInformationURLs()));
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getPrivacyStatementUrl())) {
                PrivacyStatementURL privacyStatementURL = openSamlObjects.buildDefaultInstanceOfType(PrivacyStatementURL.class);
                getUIInfo(ed).addPrivacyStatementURL(privacyStatementURL);
                privacyStatementURL.setValue(mduiRepresentation.getPrivacyStatementUrl());
                privacyStatementURL.setXMLLang("en");
            } else {
                ed.getOptionalSPSSODescriptor()
                        .flatMap(SPSSODescriptor::getOptionalExtensions)
                        .flatMap(Extensions::getOptionalUIInfo)
                        .ifPresent(u -> u.getXMLObjects().removeAll(u.getPrivacyStatementURLs()));
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getDescription())) {
                Description description = openSamlObjects.buildDefaultInstanceOfType(Description.class);
                getUIInfo(ed).addDescription(description);
                description.setValue(mduiRepresentation.getDescription());
                description.setXMLLang("en");
            } else {
                ed.getOptionalSPSSODescriptor()
                        .flatMap(SPSSODescriptor::getOptionalExtensions)
                        .flatMap(Extensions::getOptionalUIInfo)
                        .ifPresent(u -> u.getXMLObjects().removeAll(u.getDescriptions()));
            }

            if (!Strings.isNullOrEmpty(mduiRepresentation.getLogoUrl())) {
                Logo logo = openSamlObjects.buildDefaultInstanceOfType(Logo.class);
                getUIInfo(ed).addLogo(logo);
                logo.setURL(mduiRepresentation.getLogoUrl());
                logo.setHeight(mduiRepresentation.getLogoHeight());
                logo.setWidth(mduiRepresentation.getLogoWidth());
                logo.setXMLLang("en");
            } else {
                ed.getOptionalSPSSODescriptor()
                        .flatMap(SPSSODescriptor::getOptionalExtensions)
                        .flatMap(Extensions::getOptionalUIInfo)
                        .ifPresent(u -> u.getXMLObjects().removeAll(u.getLogos()));
            }
        } else {
            removeUIInfo(ed);
        }
    }
    
    public static void setupRelyingPartyOverrides(EntityDescriptor ed, EntityDescriptorRepresentation representation) {
        if (representation.getRelyingPartyOverrides() != null || (representation.getAttributeRelease() != null && representation.getAttributeRelease().size() > 0)) {
            // TODO: review if we need more than a naive implementation
            getOptionalEntityAttributes(ed).ifPresent(entityAttributes -> entityAttributes.getAttributes().clear());
            getEntityAttributes(ed).getAttributes().addAll(entityService.getAttributeListFromEntityRepresentation(representation));
        } else {
            getOptionalEntityAttributes(ed).ifPresent(entityAttributes -> entityAttributes.getAttributes().clear());
        }
    }
}
