package edu.internet2.tier.shibboleth.admin.ui.domain;

public interface IActivatable {
    ActivatableType getActivatableType();

    void setEnabled(Boolean enabled);
}