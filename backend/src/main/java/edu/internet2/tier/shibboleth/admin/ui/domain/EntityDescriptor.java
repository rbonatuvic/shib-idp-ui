package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.google.common.base.MoreObjects;
import com.google.common.collect.Lists;
import lombok.EqualsAndHashCode;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.opensaml.core.xml.XMLObject;
import org.springframework.util.StringUtils;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import javax.xml.namespace.QName;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Entity
@EqualsAndHashCode(callSuper = true, exclude={"versionModifiedTimestamp"})
@Audited
public class EntityDescriptor extends AbstractDescriptor implements org.opensaml.saml.saml2.metadata.EntityDescriptor {
    private String localId;

    private String entityID;

    private String serviceProviderName;

    private boolean serviceEnabled;

    private String resourceId;

    private Long versionModifiedTimestamp;

    @OneToOne(cascade = CascadeType.ALL)
    private Organization organization;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<ContactPerson> contactPersons = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<RoleDescriptor> roleDescriptors;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "entitydesc_addlmetdatlocations_id")
    @OrderColumn
    @NotAudited
    private List<AdditionalMetadataLocation> additionalMetadataLocations = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AuthnAuthorityDescriptor authnAuthorityDescriptor;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AttributeAuthorityDescriptor attributeAuthorityDescriptor;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private PDPDescriptor pdpDescriptor;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AffiliationDescriptor affiliationDescriptor;

    public EntityDescriptor() {
        super();
        this.resourceId = UUID.randomUUID().toString();
    }

    public void setVersionModifiedTimestamp(Long versionModifiedTimestamp) {
        this.versionModifiedTimestamp = versionModifiedTimestamp;
    }

    //getters and setters
    @Override
    public String getID() {
        return this.localId;
    }

    @Override
    public void setID(String id) {
        this.localId = id;
    }

    @Override
    public String getEntityID() {
        return entityID;
    }

    @Override
    public void setEntityID(String entityID) {
        this.entityID = entityID;
    }

    public String getServiceProviderName() {
        return serviceProviderName;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    public boolean isServiceEnabled() {
        return serviceEnabled;
    }

    public void setServiceEnabled(boolean serviceEnabled) {
        this.serviceEnabled = serviceEnabled;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.RoleDescriptor> getRoleDescriptors() {
        // TODO: we're lazy now, but might need to change in the future. Also, this break concurrency, so...
        if (this.roleDescriptors == null) {
            this.roleDescriptors = new ArrayList<>();
        }

        return (List<org.opensaml.saml.saml2.metadata.RoleDescriptor>) (List<? extends org.opensaml.saml.saml2.metadata.RoleDescriptor>) this.roleDescriptors;
    }

    public void setRoleDescriptors(List<RoleDescriptor> roleDescriptors) {
        this.roleDescriptors = roleDescriptors;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.RoleDescriptor> getRoleDescriptors(QName qName) {
        return this.getRoleDescriptors()
                .stream()
                .filter(p -> p.getElementQName().equals(qName))
                .collect(Collectors.toList());
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.RoleDescriptor> getRoleDescriptors(QName qName, String s) {
        return this.getRoleDescriptors()
                .stream()
                .filter(p -> p.getElementQName().equals(qName) && p.isSupportedProtocol(s))
                .collect(Collectors.toList());
    }

    @Override
    @Transient
    public IDPSSODescriptor getIDPSSODescriptor(String s) {
        return (IDPSSODescriptor) this.getRoleDescriptors()
                .stream()
                .filter(p -> p instanceof org.opensaml.saml.saml2.metadata.IDPSSODescriptor && (StringUtils.isEmpty(s) ? true :p.isSupportedProtocol(s)))
                .findFirst()
                .orElse(null);
    }

    @Override
    @Transient
    public SPSSODescriptor getSPSSODescriptor(String s) {
        return (SPSSODescriptor) this.getRoleDescriptors()
                .stream()
                .filter(p -> p instanceof org.opensaml.saml.saml2.metadata.SPSSODescriptor && (StringUtils.isEmpty(s) ? true :p.isSupportedProtocol(s)))
                .findFirst()
                .orElse(null);
    }

    @Transient
    public Optional<SPSSODescriptor> getOptionalSPSSODescriptor(String s) {
        return Optional.ofNullable(this.getSPSSODescriptor(s));
    }

    @Transient
    public Optional<SPSSODescriptor> getOptionalSPSSODescriptor() {
        return this.getOptionalSPSSODescriptor("");
    }

    @Override
    public AuthnAuthorityDescriptor getAuthnAuthorityDescriptor(String s) {
        return authnAuthorityDescriptor;
    }

    public void setAuthnAuthorityDescriptor(AuthnAuthorityDescriptor authnAuthorityDescriptor) {
        this.authnAuthorityDescriptor = authnAuthorityDescriptor;
    }

    @Override
    public AttributeAuthorityDescriptor getAttributeAuthorityDescriptor(String s) {
        return attributeAuthorityDescriptor;
    }

    public void setAttributeAuthorityDescriptor(AttributeAuthorityDescriptor attributeAuthorityDescriptor) {
        this.attributeAuthorityDescriptor = attributeAuthorityDescriptor;
    }

    @Override
    public PDPDescriptor getPDPDescriptor(String s) {
        return pdpDescriptor;
    }

    public void setPdpDescriptor(PDPDescriptor pdpDescriptor) {
        this.pdpDescriptor = pdpDescriptor;
    }

    @Override
    public AffiliationDescriptor getAffiliationDescriptor() {
        return affiliationDescriptor;
    }

    @Override
    public void setAffiliationDescriptor(org.opensaml.saml.saml2.metadata.AffiliationDescriptor affiliationDescriptor) {
        this.affiliationDescriptor = (AffiliationDescriptor) affiliationDescriptor;
    }

    @Override
    public org.opensaml.saml.saml2.metadata.Organization getOrganization() {
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

    public void addContactPerson(ContactPerson contactPerson) {
        this.contactPersons.add(contactPerson);
    }

    public void setContactPersons(List<ContactPerson> contactPersons) {
        this.contactPersons = contactPersons;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AdditionalMetadataLocation> getAdditionalMetadataLocations() {
        return Lists.newArrayList(additionalMetadataLocations);
    }

    public void setAdditionalMetadataLocations(List<AdditionalMetadataLocation> additionalMetadataLocations) {
        this.additionalMetadataLocations = additionalMetadataLocations;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("entityID", entityID)
                //  .add("organization", organization)
                .add("id", id)
                .toString();
    }

    @Nullable
    @Override
    public List<XMLObject> getOrderedChildren() {
        final ArrayList<XMLObject> children = new ArrayList<>();

        if (getSignature() != null) {
            children.add(getSignature());
        }
        children.add(getExtensions());
        children.addAll(this.getRoleDescriptors());
        children.add(getAffiliationDescriptor());
        children.add(getOrganization());
        children.addAll(this.getContactPersons());
        children.addAll(this.getAdditionalMetadataLocations());

        return Collections.unmodifiableList(children);
    }
}
