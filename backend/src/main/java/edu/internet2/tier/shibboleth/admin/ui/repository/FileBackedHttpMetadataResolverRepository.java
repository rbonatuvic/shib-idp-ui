package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.FileBackedHttpMetadataResolver;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data CRUD repository for instances of {@link FileBackedHttpMetadataResolver}s.
 */
public interface FileBackedHttpMetadataResolverRepository extends CrudRepository<FileBackedHttpMetadataResolver, Long> {

    FileBackedHttpMetadataResolver findByName(String name);
    boolean deleteByResourceId(String resourceId);
    FileBackedHttpMetadataResolver findByResourceId(String resourceId);
}
