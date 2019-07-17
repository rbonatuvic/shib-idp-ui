package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class EntityDescriptorRepresentation implements Serializable {

    public EntityDescriptorRepresentation() {
    }

    public EntityDescriptorRepresentation(String id,
                                          String entityId,
                                          String serviceProviderName,
                                          boolean serviceEnabled,
                                          LocalDateTime createdDate,
                                          LocalDateTime modifiedDate) {
        this.id = id;
        this.entityId = entityId;
        this.serviceProviderName = serviceProviderName;
        this.serviceEnabled = serviceEnabled;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }

    private static final long serialVersionUID = 7753435553892353966L;

    private String id;

    @NotNull
    private String serviceProviderName;

    @NotNull
    private String entityId;

    private OrganizationRepresentation organization;

    private List<ContactRepresentation> contacts;

    private MduiRepresentation mdui;

    private ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptor;

    private List<LogoutEndpointRepresentation> logoutEndpoints;

    private SecurityInfoRepresentation securityInfo;

    private List<AssertionConsumerServiceRepresentation> assertionConsumerServices;

    private boolean serviceEnabled;

    private LocalDateTime createdDate;

    private LocalDateTime modifiedDate;

    private Map<String, Object> relyingPartyOverrides;

    private List<String> attributeRelease;

    private int version;

    private String createdBy;

    @JsonProperty
    private boolean current;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getServiceProviderName() {
        return serviceProviderName;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public OrganizationRepresentation getOrganization() {
        return organization;
    }

    public void setOrganization(OrganizationRepresentation organization) {
        this.organization = organization;
    }

    public List<ContactRepresentation> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactRepresentation> contacts) {
        this.contacts = contacts;
    }

    public MduiRepresentation getMdui() {
        return mdui;
    }

    public void setMdui(MduiRepresentation mdui) {
        this.mdui = mdui;
    }


    public ServiceProviderSsoDescriptorRepresentation getServiceProviderSsoDescriptor() {
        return this.getServiceProviderSsoDescriptor(false);
    }

    public ServiceProviderSsoDescriptorRepresentation getServiceProviderSsoDescriptor(boolean create) {
        if (create && this.serviceProviderSsoDescriptor == null) {
            this.serviceProviderSsoDescriptor = new ServiceProviderSsoDescriptorRepresentation();
        }
        return this.serviceProviderSsoDescriptor;
    }

    public void setServiceProviderSsoDescriptor(ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptor) {
        this.serviceProviderSsoDescriptor = serviceProviderSsoDescriptor;
    }

    public List<LogoutEndpointRepresentation> getLogoutEndpoints() {
        return this.getLogoutEndpoints(false);
    }

    public List<LogoutEndpointRepresentation> getLogoutEndpoints(boolean create) {
        if (create && this.logoutEndpoints == null) {
            this.logoutEndpoints = new ArrayList<>();
        }
        return logoutEndpoints;
    }

    public void setLogoutEndpoints(List<LogoutEndpointRepresentation> logoutEndpoints) {
        this.logoutEndpoints = logoutEndpoints;
    }

    public SecurityInfoRepresentation getSecurityInfo() {
        return securityInfo;
    }

    public void setSecurityInfo(SecurityInfoRepresentation securityInfo) {
        this.securityInfo = securityInfo;
    }

    public List<AssertionConsumerServiceRepresentation> getAssertionConsumerServices() {
        return assertionConsumerServices;
    }

    public void setAssertionConsumerServices(List<AssertionConsumerServiceRepresentation> assertionConsumerServices) {
        this.assertionConsumerServices = assertionConsumerServices;
    }

    public boolean isServiceEnabled() {
        return serviceEnabled;
    }

    public void setServiceEnabled(boolean serviceEnabled) {
        this.serviceEnabled = serviceEnabled;
    }

    public String getCreatedDate() {
        return createdDate != null ? createdDate.toString() : null;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getModifiedDate() {
        return modifiedDate != null ? modifiedDate.toString() : null;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Map<String, Object> getRelyingPartyOverrides() {
        return relyingPartyOverrides;
    }

    public void setRelyingPartyOverrides(Map<String, Object> relyingPartyOverrides) {
        this.relyingPartyOverrides = relyingPartyOverrides;
    }

    public List<String> getAttributeRelease() {
        return attributeRelease;
    }

    public void setAttributeRelease(List<String> attributeRelease) {
        this.attributeRelease = attributeRelease;
    }

    public int getVersion() {
        return version;
    }

    public void setVersion(int version) {
        this.version = version;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public boolean isCurrent() {
        return current;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }
}
