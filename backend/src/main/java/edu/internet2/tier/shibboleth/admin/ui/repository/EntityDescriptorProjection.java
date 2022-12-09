package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorProtocol;
import lombok.Getter;

import java.time.LocalDateTime;

public class EntityDescriptorProjection {
    @Getter
    boolean approved;
    @Getter
    String createdBy;
    @Getter
    LocalDateTime createdDate;
    String entityID;
    String entityId;
    @Getter
    String id;
    @Getter
    String idOfOwner;
    @Getter
    String resourceId;
    @Getter
    boolean serviceEnabled;
    @Getter
    String serviceProviderName;
    EntityDescriptorProtocol protocol;

    public EntityDescriptorProjection(String entityID, String resourceId, String serviceProviderName, String createdBy,
                                      LocalDateTime createdDate, boolean serviceEnabled, String idOfOwner,
                                      EntityDescriptorProtocol edp, boolean approved) {
        this.entityID = entityID;
        this.entityId = entityID;
        this.resourceId = resourceId;
        this.id = resourceId;
        this.serviceProviderName = serviceProviderName;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.serviceEnabled = serviceEnabled;
        this.idOfOwner = idOfOwner;
        this.protocol = edp == null ? EntityDescriptorProtocol.SAML : edp;
        this.approved = approved || serviceEnabled;
    }

    public String getEntityID() {
        return entityID;
    }

    public String getEntityId() {
        return entityId;
    }

    public EntityDescriptorProtocol getProtocol() {
        return protocol == null ? EntityDescriptorProtocol.SAML : protocol;
    }
}