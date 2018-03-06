package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.stream.Stream;


/**
 * Repository to manage {@link EntityDescriptor} instances.
 */
public interface EntityDescriptorRepository extends CrudRepository<EntityDescriptor, Long> {

    EntityDescriptor findByEntityID(String entityId);

    EntityDescriptor findByResourceId(String resourceId);

    Stream<EntityDescriptor> findAllByServiceEnabled(boolean serviceEnabled);

    @Query("select e from EntityDescriptor e")
    Stream<EntityDescriptor> findAllByCustomQueryAndStream();

}
