package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;


@Entity
@EqualsAndHashCode(callSuper = true)
public class IDPSSODescriptor extends SSODescriptor implements org.opensaml.saml.saml2.metadata.IDPSSODescriptor {

    private boolean wantAuthnRequestsSigned;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_ssoserv_id")
    private List<SingleSignOnService> singleSignOnServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_nameidmapserv_id")
    private List<NameIDMappingService> nameIDMappingServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_asseridreqserv_id")
    private List<AssertionIDRequestService> assertionIDRequestServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_attribprofile_id")
    private List<AttributeProfile> attributeProfiles = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_attrib_id")
    private List<Attribute> attributes = new ArrayList<>();

    @Override
    public Boolean getWantAuthnRequestsSigned() {
        return wantAuthnRequestsSigned;
    }

    @Override
    public XSBooleanValue getWantAuthnRequestsSignedXSBoolean() {
        return null; //TODO
    }

    @Override
    public void setWantAuthnRequestsSigned(Boolean wantAuthnRequestsSigned) {
        this.wantAuthnRequestsSigned = wantAuthnRequestsSigned;
    }

    @Override
    public void setWantAuthnRequestsSigned(XSBooleanValue xsBooleanValue) {
        //TODO
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.SingleSignOnService> getSingleSignOnServices() {
        return (List<org.opensaml.saml.saml2.metadata.SingleSignOnService>)(List<? extends org.opensaml.saml.saml2.metadata.SingleSignOnService>)singleSignOnServices;
    }

    public void setSingleSignOnServices(List<SingleSignOnService> singleSignOnServices) {
        this.singleSignOnServices = singleSignOnServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.NameIDMappingService> getNameIDMappingServices() {
        return (List<org.opensaml.saml.saml2.metadata.NameIDMappingService>)(List<? extends org.opensaml.saml.saml2.metadata.NameIDMappingService>)nameIDMappingServices;
    }

    public void setNameIDMappingServices(List<NameIDMappingService> nameIDMappingServices) {
        this.nameIDMappingServices = nameIDMappingServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService> getAssertionIDRequestServices() {
        return (List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService>)(List<? extends org.opensaml.saml.saml2.metadata.AssertionIDRequestService>)assertionIDRequestServices;
    }

    public void setAssertionIDRequestServices(List<AssertionIDRequestService> assertionIDRequestServices) {
        this.assertionIDRequestServices = assertionIDRequestServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AttributeProfile> getAttributeProfiles() {
        return (List<org.opensaml.saml.saml2.metadata.AttributeProfile>)(List<? extends org.opensaml.saml.saml2.metadata.AttributeProfile>)attributeProfiles;
    }

    public void setAttributeProfiles(List<AttributeProfile> attributeProfiles) {
        this.attributeProfiles = attributeProfiles;
    }

    @Override
    public List<org.opensaml.saml.saml2.core.Attribute> getAttributes() {
        return (List<org.opensaml.saml.saml2.core.Attribute>)(List<? extends org.opensaml.saml.saml2.core.Attribute>)attributes;
    }

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }
}
