package edu.internet2.tier.shibboleth.admin.ui.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.MoreObjects;
import com.google.common.collect.Lists;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.OwnableType;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import org.opensaml.core.xml.XMLObject;
import org.springframework.util.StringUtils;

import javax.annotation.Nullable;
import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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

import static edu.internet2.tier.shibboleth.admin.ui.domain.ActivatableType.ENTITY_DESCRIPTOR;

@Entity
@EqualsAndHashCode(callSuper = true)
@Audited
public class EntityDescriptor extends AbstractDescriptor implements org.opensaml.saml.saml2.metadata.EntityDescriptor, Ownable, IActivatable {
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "entitydesc_addlmetdatlocations_id")
    @OrderColumn
    @NotAudited
    private List<AdditionalMetadataLocation> additionalMetadataLocations = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AffiliationDescriptor affiliationDescriptor;

    @Getter
    @Setter
    private boolean approved;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AttributeAuthorityDescriptor attributeAuthorityDescriptor;

    @ElementCollection (fetch = FetchType.EAGER)
    @EqualsAndHashCode.Exclude
    private List<String> approvedBy = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private AuthnAuthorityDescriptor authnAuthorityDescriptor;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<ContactPerson> contactPersons = new ArrayList<>();

    private String entityID;

    @Getter
    @Setter
    private String idOfOwner;

    private String localId;

    @OneToOne(cascade = CascadeType.ALL)
    private Organization organization;

    @OneToOne(cascade = CascadeType.ALL)
    @NotAudited
    private PDPDescriptor pdpDescriptor;

    @Setter
    private EntityDescriptorProtocol protocol = EntityDescriptorProtocol.SAML;

    private String resourceId;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<RoleDescriptor> roleDescriptors;

    private boolean serviceEnabled;

    private String serviceProviderName;

    @EqualsAndHashCode.Exclude
    private Long versionModifiedTimestamp;

    public EntityDescriptor() {
        super();
        this.resourceId = UUID.randomUUID().toString();
    }

    public void addApproval(Group group) {
        approvedBy.add(group.getName());
    }

    public void addContactPerson(ContactPerson contactPerson) {
        this.contactPersons.add(contactPerson);
    }

    public int approvedCount() {
        return approvedBy.size();
    }

    @Override public ActivatableType getActivatableType() {
        return ENTITY_DESCRIPTOR;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.AdditionalMetadataLocation> getAdditionalMetadataLocations() {
        return Lists.newArrayList(additionalMetadataLocations);
    }

    @Override
    public AffiliationDescriptor getAffiliationDescriptor() {
        return affiliationDescriptor;
    }

    @Override
    public AttributeAuthorityDescriptor getAttributeAuthorityDescriptor(String s) {
        return attributeAuthorityDescriptor;
    }

    @Override
    public AuthnAuthorityDescriptor getAuthnAuthorityDescriptor(String s) {
        return authnAuthorityDescriptor;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.ContactPerson> getContactPersons() {
        return (List<org.opensaml.saml.saml2.metadata.ContactPerson>) (List<? extends org.opensaml.saml.saml2.metadata.ContactPerson>) this.contactPersons;
    }

    @Override
    public String getEntityID() {
        return entityID;
    }

    @Override
    public String getID() {
        return this.localId;
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

    public String getObjectId() {
        return entityID;
    }

    @Transient
    public Optional<SPSSODescriptor> getOptionalSPSSODescriptor() {
        return this.getOptionalSPSSODescriptor("");
    }

    @Transient
    public Optional<SPSSODescriptor> getOptionalSPSSODescriptor(String s) {
        return Optional.ofNullable(this.getSPSSODescriptor(s));
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

    @Override
    public org.opensaml.saml.saml2.metadata.Organization getOrganization() {
        return organization;
    }

    public OwnableType getOwnableType() {
        return OwnableType.ENTITY_DESCRIPTOR;
    }

    public EntityDescriptorProtocol getProtocol() {
        return protocol == null ? EntityDescriptorProtocol.SAML : protocol;
    }

    @Override
    public PDPDescriptor getPDPDescriptor(String s) {
        return pdpDescriptor;
    }

    public String getResourceId() {
        return resourceId;
    }

    @Override
    public List<org.opensaml.saml.saml2.metadata.RoleDescriptor> getRoleDescriptors() {
        // TODO: we're lazy now, but might need to change in the future. Also, this break concurrency, so...
        if (this.roleDescriptors == null) {
            this.roleDescriptors = new ArrayList<>();
        }

        return (List<org.opensaml.saml.saml2.metadata.RoleDescriptor>) (List<? extends org.opensaml.saml.saml2.metadata.RoleDescriptor>) this.roleDescriptors;
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

    public String getServiceProviderName() {
        return serviceProviderName;
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

    @JsonIgnore
    public boolean hasKeyDescriptors() {
        SPSSODescriptor spssoDescriptor = getSPSSODescriptor("");
        return spssoDescriptor != null && spssoDescriptor.getKeyDescriptors().size() > 0;
    }

    @JsonIgnore
    public boolean isAuthnRequestsSigned() {
        SPSSODescriptor spssoDescriptor = getSPSSODescriptor("");
        return spssoDescriptor != null && spssoDescriptor.isAuthnRequestsSigned() != null && spssoDescriptor.isAuthnRequestsSigned();
    }

    @JsonIgnore
    public boolean isOidcProtocol() {
        return getSPSSODescriptor("") != null && getProtocol() == EntityDescriptorProtocol.OIDC;
    }

    public boolean isServiceEnabled() {
        return serviceEnabled;
    }

    public void removeLastApproval() {
        if (!approvedBy.isEmpty()) {
            approvedBy.remove(approvedBy.size() - 1);
        }
    }

    public void setAdditionalMetadataLocations(List<AdditionalMetadataLocation> additionalMetadataLocations) {
        this.additionalMetadataLocations = additionalMetadataLocations;
    }

    @Override
    public void setAffiliationDescriptor(org.opensaml.saml.saml2.metadata.AffiliationDescriptor affiliationDescriptor) {
        this.affiliationDescriptor = (AffiliationDescriptor) affiliationDescriptor;
    }

    public void setAttributeAuthorityDescriptor(AttributeAuthorityDescriptor attributeAuthorityDescriptor) {
        this.attributeAuthorityDescriptor = attributeAuthorityDescriptor;
    }

    public void setAuthnAuthorityDescriptor(AuthnAuthorityDescriptor authnAuthorityDescriptor) {
        this.authnAuthorityDescriptor = authnAuthorityDescriptor;
    }

    public void setContactPersons(List<ContactPerson> contactPersons) {
        this.contactPersons = contactPersons;
    }

    @Override
    public void setEntityID(String entityID) {
        this.entityID = entityID;
    }

    public void setEnabled(Boolean serviceEnabled) {
        this.serviceEnabled = (serviceEnabled == null) ? false : serviceEnabled;
    }

    @Override
    public void setID(String id) {
        this.localId = id;
    }

    @Override
    public void setOrganization(org.opensaml.saml.saml2.metadata.Organization organization) {
        this.organization = (Organization) organization;
    }

    public void setPdpDescriptor(PDPDescriptor pdpDescriptor) {
        this.pdpDescriptor = pdpDescriptor;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public void setRoleDescriptors(List<RoleDescriptor> roleDescriptors) {
        this.roleDescriptors = roleDescriptors;
    }

    public void setServiceEnabled(boolean serviceEnabled) {
        this.serviceEnabled = serviceEnabled;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    public void setVersionModifiedTimestamp(Long versionModifiedTimestamp) {
        this.versionModifiedTimestamp = versionModifiedTimestamp;
    }

    @Override
    public String toString() {
        return MoreObjects.toStringHelper(this)
                .add("entityID", entityID)
                //  .add("organization", organization)
                .add("id", id)
                .toString();
    }

    @JsonIgnore
    public boolean wantsAssertionsSigned() {
        SPSSODescriptor spssoDescriptor = getSPSSODescriptor("");
        return  spssoDescriptor != null && spssoDescriptor.getWantAssertionsSigned() != null && spssoDescriptor.getWantAssertionsSigned();
    }
}