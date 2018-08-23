package edu.internet2.tier.shibboleth.admin.ui.service;

import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
public class DirectoryServiceImpl implements DirectoryService {
    private Map<String, Directory> directoryMap = new HashMap<>();

    @Override
    public Directory getDirectory(String resourceId) {
        Directory directory = directoryMap.get(resourceId);
        if (directory == null) {
            directory = new RAMDirectory();
            directoryMap.put(resourceId, directory);
        }
        return directory;
    }

    @Override
    public List<Directory> getDirectories() {
        return new ArrayList<>(directoryMap.values());
    }
}
