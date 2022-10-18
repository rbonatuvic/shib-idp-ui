package edu.internet2.tier.shibboleth.admin.ui.repository;

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
    boolean getApproved();
}