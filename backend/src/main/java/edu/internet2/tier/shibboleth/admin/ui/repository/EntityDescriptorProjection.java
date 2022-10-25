package edu.internet2.tier.shibboleth.admin.ui.repository;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonInclude;
import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorProtocol;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class EntityDescriptorProjection {
    @Getter
    String id;
    String entityID;
    String entityId;
    @Getter
    String resourceId;
    @Getter
    String serviceProviderName;
    @Getter
    String createdBy;
    @Getter
    LocalDateTime createdDate;
    @Getter
    boolean serviceEnabled;
    @Getter
    String idOfOwner;

    EntityDescriptorProtocol protocol;

    public EntityDescriptorProjection(String entityID, String resourceId, String serviceProviderName, String createdBy,
                                      LocalDateTime createdDate, boolean serviceEnabled, String idOfOwner, EntityDescriptorProtocol edp) {
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

//    public void setProtocol(int i) {
//        protocol = EntityDescriptorProtocol.values()[i];
//    }
}