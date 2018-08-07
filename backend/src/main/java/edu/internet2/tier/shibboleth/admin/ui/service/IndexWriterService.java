package edu.internet2.tier.shibboleth.admin.ui.service;

import org.apache.lucene.index.IndexWriter;

import java.io.IOException;

/**
 * API component responsible for entity ids search.
 */
@FunctionalInterface
public interface IndexWriterService {
    /**
     * Return a (possibly cached) index writer for a given resource id.
     * @param resourceId the resource to create the IndexWriter for
     * @return IndexWriter
     */
    IndexWriter getIndexWriter(String resourceId) throws IOException;
}
