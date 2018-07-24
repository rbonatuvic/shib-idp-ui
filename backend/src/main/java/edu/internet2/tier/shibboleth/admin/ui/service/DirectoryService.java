package edu.internet2.tier.shibboleth.admin.ui.service;

import org.apache.lucene.store.Directory;

/**
 * API component responsible for entity ids search.
 */
@FunctionalInterface
public interface DirectoryService {
    /**
     * Return a Directory for a given resource id. If one is not found, it will be created.
     * @param resourceId the resource to get the Directory for
     * @return Directory
     */
    Directory getDirectory(String resourceId);
}
