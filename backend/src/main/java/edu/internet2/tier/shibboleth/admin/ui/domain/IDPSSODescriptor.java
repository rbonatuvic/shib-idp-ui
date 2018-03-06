package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;
import org.opensaml.core.xml.schema.XSBooleanValue;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;


@Entity
public class IDPSSODescriptor extends SSODescriptor implements org.opensaml.saml.saml2.metadata.IDPSSODescriptor {

    private boolean wantAuthnRequestsSigned;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_ssoserv_id")
    private List<SingleSignOnService> singleSignOnServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_nameidmapserv_id")
    private List<NameIDMappingService> nameIDMappingServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_asseridreqserv_id")
    private List<AssertionIDRequestService> assertionIDRequestServices;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_attribprofile_id")
    private List<AttributeProfile> attributeProfiles;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "idpssodesc_attrib_id")
    private List<Attribute> attributes;

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
        return Lists.newArrayList(singleSignOnServices);
    }

    public void setSingleSignOnServices(List<SingleSignOnService> singleSignOnServices) {
        this.singleSignOnServices = singleSignOnServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.NameIDMappingService> getNameIDMappingServices() {
        return Lists.newArrayList(nameIDMappingServices);
    }

    public void setNameIDMappingServices(List<NameIDMappingService> nameIDMappingServices) {
        this.nameIDMappingServices = nameIDMappingServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService> getAssertionIDRequestServices() {
        return Lists.newArrayList(assertionIDRequestServices);
    }

    public void setAssertionIDRequestServices(List<AssertionIDRequestService> assertionIDRequestServices) {
        this.assertionIDRequestServices = assertionIDRequestServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AttributeProfile> getAttributeProfiles() {
        return Lists.newArrayList(attributeProfiles);
    }

    public void setAttributeProfiles(List<AttributeProfile> attributeProfiles) {
        this.attributeProfiles = attributeProfiles;
    }

    @Override
    public List<org.opensaml.saml.saml2.core.Attribute> getAttributes() {
        return Lists.newArrayList(attributes);
    }

    public void setAttributes(List<Attribute> attributes) {
        this.attributes = attributes;
    }
}
