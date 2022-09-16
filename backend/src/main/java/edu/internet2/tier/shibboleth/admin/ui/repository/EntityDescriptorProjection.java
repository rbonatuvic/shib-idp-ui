package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptorProtocol;

import java.time.LocalDateTime;

public interface EntityDescriptorProjection {
    default String getId() {
        return getResourceId();
    }
    String getEntityID();
    default String getEntityId() {
        return getEntityID();
    }
    String getResourceId();
    String getServiceProviderName();
    String getCreatedBy();
    LocalDateTime getCreatedDate();
    boolean getServiceEnabled();
    String getIdOfOwner();
    EntityDescriptorProtocol getProtocol();
}