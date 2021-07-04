package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class EntityDescriptorRepresentation implements Serializable {
    private static final long serialVersionUID = 7753435553892353966L;

    private List<AssertionConsumerServiceRepresentation> assertionConsumerServices;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<String> attributeRelease;

    private List<ContactRepresentation> contacts;

    private String createdBy;

    private LocalDateTime createdDate;

    @JsonProperty
    private boolean current;

    @NotNull
    private String entityId;

    @Setter
    private String groupId;
    
    private String id;

    private List<LogoutEndpointRepresentation> logoutEndpoints;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private MduiRepresentation mdui;

    private LocalDateTime modifiedDate;

    //TODO: review requirement
    private OrganizationRepresentation organization = new OrganizationRepresentation();

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Map<String, Object> relyingPartyOverrides;

    private SecurityInfoRepresentation securityInfo;

    private boolean serviceEnabled;

    @NotNull
    private String serviceProviderName;

    private ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptor;

    private int version;

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

    public List<AssertionConsumerServiceRepresentation> getAssertionConsumerServices() {
        return assertionConsumerServices;
    }

    public List<String> getAttributeRelease() {
        return attributeRelease;
    }

    public List<ContactRepresentation> getContacts() {
        return contacts;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getCreatedDate() {
        return createdDate != null ? createdDate.toString() : null;
    }

    public String getEntityId() {
        return entityId;
    }

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId == null ? Group.DEFAULT_GROUP.getResourceId() : groupId;
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

    public MduiRepresentation getMdui() {
        return mdui;
    }

    public String getModifiedDate() {
        return modifiedDate != null ? modifiedDate.toString() : null;
    }

    @JsonIgnore
    public LocalDateTime getModifiedDateAsDate() {
        // we shouldn't have an ED without either modified or created date, so this is mostly for testing where data can be odd
        return modifiedDate != null ? modifiedDate : createdDate != null ? createdDate : LocalDateTime.now();
    }


    public OrganizationRepresentation getOrganization() {
        return organization;
    }

    public Map<String, Object> getRelyingPartyOverrides() {
        return relyingPartyOverrides;
    }

    public SecurityInfoRepresentation getSecurityInfo() {
        return securityInfo;
    }

    public String getServiceProviderName() {
        return serviceProviderName;
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

    public int getVersion() {
        return version;
    }

    public boolean isCurrent() {
        return current;
    }

    public boolean isServiceEnabled() {
        return serviceEnabled;
    }

    public void setAssertionConsumerServices(List<AssertionConsumerServiceRepresentation> assertionConsumerServices) {
        this.assertionConsumerServices = assertionConsumerServices;
    }

    public void setAttributeRelease(List<String> attributeRelease) {
        this.attributeRelease = attributeRelease;
    }

    public void setContacts(List<ContactRepresentation> contacts) {
        this.contacts = contacts;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setCurrent(boolean current) {
        this.current = current;
    }
    
    public void setEntityId(String entityId) {
        this.entityId = entityId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setLogoutEndpoints(List<LogoutEndpointRepresentation> logoutEndpoints) {
        this.logoutEndpoints = logoutEndpoints;
    }

    public void setMdui(MduiRepresentation mdui) {
        this.mdui = mdui;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public void setOrganization(OrganizationRepresentation organization) {
        this.organization = organization;
    }

    public void setRelyingPartyOverrides(Map<String, Object> relyingPartyOverrides) {
        this.relyingPartyOverrides = relyingPartyOverrides;
    }

    public void setSecurityInfo(SecurityInfoRepresentation securityInfo) {
        this.securityInfo = securityInfo;
    }

    public void setServiceEnabled(boolean serviceEnabled) {
        this.serviceEnabled = serviceEnabled;
    }

    public void setServiceProviderName(String serviceProviderName) {
        this.serviceProviderName = serviceProviderName;
    }

    public void setServiceProviderSsoDescriptor(ServiceProviderSsoDescriptorRepresentation serviceProviderSsoDescriptor) {
        this.serviceProviderSsoDescriptor = serviceProviderSsoDescriptor;
    }

    public void setVersion(int version) {
        this.version = version;
    }
}
