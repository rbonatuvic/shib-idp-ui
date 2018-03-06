package edu.internet2.tier.shibboleth.admin.ui.domain;

import org.opensaml.core.xml.XMLObject;
import org.opensaml.core.xml.util.AttributeMap;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.persistence.ElementCollection;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import javax.xml.namespace.QName;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Entity
public class RoleDescriptor extends AbstractDescriptor implements org.opensaml.saml.saml2.metadata.RoleDescriptor {

    @ElementCollection
    private List<String> supportedProtocols = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "roledesc_keydesc_id")
    private List<KeyDescriptor> keyDescriptors = new ArrayList<>(); // TODO: implement

    @OneToOne(cascade = CascadeType.ALL)
    private Organization organization;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "roledesc_contactperson_id")
    private List<ContactPerson> contactPersons = new ArrayList<>(); // TODO: implement

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "roledesc_endpoint_id")
    private List<Endpoint> endpoints = new ArrayList<>();

    private boolean isSupportedProtocol;

    private String errorURL;

    private String localId;

    @Transient
    private AttributeMap unknownAttributes;

    public RoleDescriptor() {
        this.unknownAttributes = new AttributeMap(this);
    }

    @Override
    public String getID() {
        return this.localId;
    }

    @Override
    public void setID(String id) {
        this.localId = id;
    }

    @Override
    public List<String> getSupportedProtocols() {
        return supportedProtocols;
    }

    public void setSupportedProtocols(List<String> supportedProtocols) {
        this.supportedProtocols = supportedProtocols;
    }

    @Override
    public boolean isSupportedProtocol(String s) {
        return isSupportedProtocol;
    }

    public void setIsSupportedProtocol(boolean isSupportedProtocol) {
        this.isSupportedProtocol = isSupportedProtocol;
    }

    @Override
    public void addSupportedProtocol(String supportedProtocol) {
        supportedProtocols.add(supportedProtocol);
    }

    @Override
    public void removeSupportedProtocol(String supportedProtocol) {
        //TODO
    }

    @Override
    public void removeSupportedProtocols(Collection<String> collection) {
        //TODO
    }

    @Override
    public void removeAllSupportedProtocols() {
        //TODO
    }

    @Override
    public String getErrorURL() {
        return errorURL;
    }

    @Override
    public void setErrorURL(String errorURL) {
        this.errorURL = errorURL;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.KeyDescriptor> getKeyDescriptors() {
        return (List<org.opensaml.saml.saml2.metadata.KeyDescriptor>) (List<? extends org.opensaml.saml.saml2.metadata.KeyDescriptor>) this.keyDescriptors;
    }

    public void addKeyDescriptor(KeyDescriptor keyDescriptor) {
        this.keyDescriptors.add(keyDescriptor);
    }

    public void setKeyDescriptors(List<KeyDescriptor> keyDescriptors) {
        this.keyDescriptors = keyDescriptors;
    }

    @Override
    public Organization getOrganization() {
        return organization;
    }

    @Override
    public void setOrganization(org.opensaml.saml.saml2.metadata.Organization organization) {
        this.organization = (Organization) organization;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.ContactPerson> getContactPersons() {
        return (List<org.opensaml.saml.saml2.metadata.ContactPerson>) (List<? extends org.opensaml.saml.saml2.metadata.ContactPerson>) this.contactPersons;
    }

    public void setContactPersons(List<ContactPerson> contactPersons) {
        this.contactPersons = contactPersons;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.Endpoint> getEndpoints() {
        return (List<org.opensaml.saml.saml2.metadata.Endpoint>) (List<? extends org.opensaml.saml.saml2.metadata.Endpoint>) this.endpoints;
    }

    public void setEndpoints(List<Endpoint> endpoints) {
        this.endpoints = endpoints;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.Endpoint> getEndpoints(QName qName) {
        return null; //TODO?
    }

    @Nonnull
    @Override
    public AttributeMap getUnknownAttributes() {
        return unknownAttributes;
    }

    public void setUnknownAttributes(AttributeMap unknownAttributes) {
        this.unknownAttributes = unknownAttributes;
    }

    @Nullable
    @Override
    @Transient
    public List<XMLObject> getOrderedChildren() {
        ArrayList<XMLObject> children = new ArrayList<>();

        if (getSignature() != null) {
            children.add(getSignature());
        }

        if (getExtensions() != null) {
            children.add(getExtensions());
        }
        children.addAll(getKeyDescriptors());
        if (organization != null) {
            children.add(getOrganization());
        }
        children.addAll(getContactPersons());

        return Collections.unmodifiableList(children);
    }
}
