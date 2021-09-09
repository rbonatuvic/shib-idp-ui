package edu.internet2.tier.shibboleth.admin.ui.security.model;

public interface Ownable {
    /**
     * @return representation of the id of the object. This is likely (but not limited to) the resource id of the object
     */
    String getObjectId();

    /**
     * @return the OwnableType that describes the Ownable object
     */
    OwnableType getOwnableType();
}