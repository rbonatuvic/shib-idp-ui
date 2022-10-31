package edu.internet2.tier.shibboleth.admin.ui.security.permission;

import java.io.Serializable;

/**
 * Will be used as a key for PersmissionEvaluator return types
 */
public interface IPersistentEntityTuple extends Serializable {
    /**
     * Returns the database id of the database-entity. The id may originally be string, int, long, etc - it will be up to implementing
     * code to correctly hand the id based on the type of entity when using the id to fetch.
     * @return String the id of the entity.
     */
    String getId();

    /**
     * The persistant entity type associated with the id
     * @return the class of the database entity that the id is associated with
     */
    Class getType();

}