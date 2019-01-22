package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.stream.Stream;


/**
 * Repository to manage {@link EntityDescriptor} instances.
 */
public interface EntityDescriptorRepository extends JpaRepository<EntityDescriptor, Long> {

    EntityDescriptor findByEntityID(String entityId);

    EntityDescriptor findByResourceId(String resourceId);

    Stream<EntityDescriptor> findAllByServiceEnabled(boolean serviceEnabled);

    @Query("select e from EntityDescriptor e")
    Stream<EntityDescriptor> findAllByCustomQueryAndStream();

    @Query("select e from EntityDescriptor e, User u join u.roles r " +
            "where e.createdBy = u.username and e.serviceEnabled = false and r.name in ('ROLE_USER', 'ROLE_NONE')")
    Stream<EntityDescriptor> findAllDisabledAndNotOwnedByAdmin();
}
