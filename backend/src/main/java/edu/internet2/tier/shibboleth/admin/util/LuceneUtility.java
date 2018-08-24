package edu.internet2.tier.shibboleth.admin.util;

import edu.internet2.tier.shibboleth.admin.ui.service.DirectoryService;
import org.apache.commons.lang.StringUtils;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexReader;
import org.apache.lucene.index.MultiReader;
import org.apache.lucene.store.Directory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class LuceneUtility {
    private static final Logger logger = LoggerFactory.getLogger(LuceneUtility.class);
    private DirectoryService directoryService;

    public LuceneUtility(DirectoryService directoryService) {
        this.directoryService = directoryService;
    }

    public IndexReader getIndexReader(String resourceId) throws IOException {
        IndexReader indexReader;
        if (StringUtils.isBlank(resourceId)) {
            List<Directory> directories = directoryService.getDirectories();
            List<IndexReader> indexReaderList = new ArrayList<>();
            directories.forEach(it -> {
                try {
                    indexReaderList.add(DirectoryReader.open(it));
                } catch (IOException e) {
                    logger.error(e.getMessage(), e);
                }
            });
            IndexReader[] indexReaders = new IndexReader[indexReaderList.size()];
            indexReaders = indexReaderList.toArray(indexReaders);
            indexReader = new MultiReader(indexReaders, true);
        } else {
            indexReader = DirectoryReader.open(directoryService.getDirectory(resourceId));
        }
        return indexReader;
    }
}
