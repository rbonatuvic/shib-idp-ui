package edu.internet2.tier.shibboleth.admin.ui.domain;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;

public interface IActivatable {
    ActivatableType getActivatableType();

    void setEnabled(Boolean enabled);

    default String getIdOfOwner() {
        return Group.ADMIN_GROUP.getName();
    }
}