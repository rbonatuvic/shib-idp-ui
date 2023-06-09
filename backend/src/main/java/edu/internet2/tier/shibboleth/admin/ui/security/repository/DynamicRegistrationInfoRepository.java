package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DynamicRegistrationInfoRepository extends JpaRepository<DynamicRegistrationInfo, String> {
    List<DynamicRegistrationInfo> findAllByIdOfOwner(String idOfOwner);

    @Query(value="SELECT dri.resourceId FROM DynamicRegistrationInfo dri WHERE dri.idOfOwner = :groupId AND dri.enabled = false")
    List<String> findAllResourceIdsByIdOfOwnerAndNotEnabled(@Param("groupId") String groupId);

    DynamicRegistrationInfo findByResourceId(String id);

    @Query(value = "SELECT dri FROM DynamicRegistrationInfo dri " +
                   " WHERE dri.idOfOwner IN (:groupIds)" +
                   "   AND dri.enabled = false" +
                   "   AND dri.approved = false")
    List<DynamicRegistrationInfo> getAllNeedingApproval(@Param("groupIds") List<String> groupIds);

    @Query(value = "SELECT dri FROM DynamicRegistrationInfo dri WHERE dri.enabled = false")
    List<DynamicRegistrationInfo> getDynamicRegistrationsNeedingEnabling();

    @Query(value = "SELECT dri FROM DynamicRegistrationInfo dri " +
                   " WHERE dri.idOfOwner = :groupId" +
                   "   AND dri.enabled = false" +
                   "   AND dri.approved = true")
    List<DynamicRegistrationInfo> getDynamicRegistrationsNeedingEnabling(@Param("groupId") String groupId);
}