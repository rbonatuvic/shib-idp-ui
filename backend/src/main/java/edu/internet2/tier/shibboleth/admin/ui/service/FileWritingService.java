package edu.internet2.tier.shibboleth.admin.ui.service;

import org.springframework.core.io.WritableResource;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Service interface for writing files. Implementations may perform various tasks
 * before or after writing the file.
 */
public interface FileWritingService {
    /**
     * Write content to a file
     *
     * @param path target file Path
     * @param content content to write
     * @throws IOException
     */
    void write(Path path, String content) throws IOException;

    /**
     * Write content to a writeable resource
     *
     * @param resource
     * @param content
     * @throws IOException
     */
    void write(WritableResource resource, String content) throws IOException;
}
