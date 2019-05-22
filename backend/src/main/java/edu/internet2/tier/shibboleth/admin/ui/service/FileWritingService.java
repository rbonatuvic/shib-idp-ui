package edu.internet2.tier.shibboleth.admin.ui.service;

import java.io.IOException;
import java.nio.file.Path;

/**
 * Service interface for writing files. Implementations may perform various tasks
 * before or after writing the file.
 */
public interface FileWritingService {
    /**
     * write the file
     *
     * @param path target file Path
     * @param content content to write
     * @throws IOException
     */
    void write(Path path, String content) throws IOException;
}
