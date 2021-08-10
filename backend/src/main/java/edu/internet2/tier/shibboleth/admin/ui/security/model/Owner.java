package edu.internet2.tier.shibboleth.admin.ui.security.model;

public interface Owner {
    /**
     * @return representation of the id of the owner. This is likely (but not limited to) the resource id of the owner
     */
    public String getOwnerId();

    /**
     * @return the type describing the owner
     */
    public OwnerType getOwnerType();
}