package edu.internet2.tier.shibboleth.admin.ui.security.service;

import java.io.Serializable;

/**
 * Will be used as a key for PersmissionEvaluator return types
 */
public interface IPersistentEntityTupple extends Serializable {

    String getId();

    Class getType();

}
