package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.opensaml;

/**
 * Indicates that the resolver implementing this interface is a resolver that allows for its metadata to be
 * filtered multiple times.
 *
 * @author Bill Smith (wsmith@unicon.net)
 */
public interface Refilterable {

    /**
     * Reapply this resolver's filters to its cached, unfiltered metadata, and set the result back to its cached,
     * filtered metadata.
     */
    void refilter();
}