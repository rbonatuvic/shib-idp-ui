package edu.internet2.tier.shibboleth.admin.ui.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.EntityDescriptor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.stream.Stream;


/**
 * Repository to manage {@link EntityDescriptor} instances.
 */
public interface EntityDescriptorRepository extends JpaRepository<EntityDescriptor, Long> {

    @Query(value="SELECT e.resourceId FROM EntityDescriptor e WHERE e.idOfOwner = :groupId AND e.serviceEnabled = false")
    List<String> findAllResourceIdsByIdOfOwnerAndNotEnabled(@Param("groupId") String groupId);

    @Query(value = "select new edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection(e.entityID, e.resourceId, e.serviceProviderName, e.createdBy, " +
                   "e.createdDate, e.serviceEnabled, e.idOfOwner, e.protocol, e.approved) " +
                   "from EntityDescriptor e")
    List<EntityDescriptorProjection> findAllReturnProjections();

    @Query(value = "select new edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection(e.entityID, e.resourceId, e.serviceProviderName, e.createdBy, " +
                   "e.createdDate, e.serviceEnabled, e.idOfOwner, e.protocol, e.approved) " +
                   "from EntityDescriptor e " +
                   "where e.idOfOwner = :ownerId")
    List<EntityDescriptorProjection> findAllByIdOfOwner(@Param("ownerId") String ownerId);

    EntityDescriptor findByEntityID(String entityId);

    EntityDescriptor findByResourceId(String resourceId);

    Stream<EntityDescriptor> findAllStreamByServiceEnabled(boolean serviceEnabled);

    @Query("select e from EntityDescriptor e")
    Stream<EntityDescriptor> findAllStreamByCustomQuery();

    Stream<EntityDescriptor> findAllStreamByIdOfOwner(String ownerId);
    
    @Query(value = "select new edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection(e.entityID, e.resourceId, e.serviceProviderName, e.createdBy, " +
                    "e.createdDate, e.serviceEnabled, e.idOfOwner, e.protocol, e.approved) " +
                    "  from EntityDescriptor e " +
                    " where e.serviceEnabled = false"
    )
    List<EntityDescriptorProjection> getEntityDescriptorsNeedingEnabling();
    
    /**
     * SHIBUI-1740 This is here to aid in migration of systems using the SHIBUI prior to group functionality being added
     * @deprecated - this is intended to be removed at some future date and is here only for migration purposes.
     */
    @Deprecated
    List<EntityDescriptor> findAllByIdOfOwnerIsNull();

    @Query(value = "select new edu.internet2.tier.shibboleth.admin.ui.repository.EntityDescriptorProjection(e.entityID, e.resourceId, e.serviceProviderName, e.createdBy, " +
                   "e.createdDate, e.serviceEnabled, e.idOfOwner, e.protocol, e.approved) " +
                   "  from EntityDescriptor e " +
                   " where e.idOfOwner in (:groupIds)" +
                   "   and e.serviceEnabled = false" +
                   "   and e.approved = false")
    List<EntityDescriptorProjection> getEntityDescriptorsNeedingApproval(@Param("groupIds") List<String> groupIds);

}