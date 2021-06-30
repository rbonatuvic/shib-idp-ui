package edu.internet2.tier.shibboleth.admin.ui.security.service;

public enum UserAccess {
    ADMIN, // Access to everything
    GROUP, // Group users also should have owner access
    OWNER, // Only access things this user created/owns
    NONE //
}
