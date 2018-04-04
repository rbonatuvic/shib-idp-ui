package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.collect.Lists;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;


@Entity
public class AttributeAuthorityDescriptor extends RoleDescriptor implements org.opensaml.saml.saml2.metadata.AttributeAuthorityDescriptor {

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribauthdesc_attribserv_id")
    private List<AttributeService> attributeServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribauthdesc_assertidreqservc_id")
    private List<AssertionIDRequestService> assertionIDRequestServices = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribauthdesc_nameidfrmt_id")
    private List<NameIDFormat> nameIDFormats = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribauthdesc_attribprofile_id")
    private List<AttributeProfile> attributeProfiles = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "attribauthdesc_attrib_id")
    private List<Attribute> attributes = new ArrayList<>();


    @Override
    public List<org.opensaml.saml.saml2.metadata.AttributeService> getAttributeServices() {
        return (List<org.opensaml.saml.saml2.metadata.AttributeService>)(List<? extends org.opensaml.saml.saml2.metadata.AttributeService>)attributeServices;
    }

    public void setAttributeServices(List<AttributeService> attributeServices) {
        this.attributeServices = attributeServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService> getAssertionIDRequestServices() {
        return (List<org.opensaml.saml.saml2.metadata.AssertionIDRequestService>)(List<? extends org.opensaml.saml.saml2.metadata.AssertionIDRequestService>)assertionIDRequestServices;
    }

    public void setAssertionIDRequestServices(List<AssertionIDRequestService> assertionIDRequestServices) {
        this.assertionIDRequestServices = assertionIDRequestServices;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.NameIDFormat> getNameIDFormats() {
        return (List<org.opensaml.saml.saml2.metadata.NameIDFormat>)(List<? extends org.opensaml.saml.saml2.metadata.NameIDFormat>)nameIDFormats;
    }

    public void setNameIDFormats(List<NameIDFormat> nameIDFormats) {
        this.nameIDFormats = nameIDFormats;
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
