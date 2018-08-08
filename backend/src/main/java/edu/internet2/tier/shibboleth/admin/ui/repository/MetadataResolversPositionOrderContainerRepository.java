package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.resolvers.MetadataResolversPositionOrderContainer;
import org.springframework.data.repository.CrudRepository;

/**
 * Spring Data Repository API for persistence operations on instances of {@link MetadataResolversPositionOrderContainer}.
 *
 * @author Dmitriy Kopylenko
 */
public interface MetadataResolversPositionOrderContainerRepository
        extends CrudRepository<MetadataResolversPositionOrderContainer, Long> {
}
