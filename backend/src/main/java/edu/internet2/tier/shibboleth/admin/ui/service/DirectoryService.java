package edu.internet2.tier.shibboleth.admin.ui.service;

import org.apache.lucene.store.Directory;

import java.util.List;

/**
 * API component responsible for entity ids search.
 */
public interface DirectoryService {
    /**
     * Return a Directory for a given resource id. If one is not found, it will be created.
     * @param resourceId the resource to get the Directory for
     * @return Directory
     */
    Directory getDirectory(String resourceId);

    List<Directory> getDirectories();
}
