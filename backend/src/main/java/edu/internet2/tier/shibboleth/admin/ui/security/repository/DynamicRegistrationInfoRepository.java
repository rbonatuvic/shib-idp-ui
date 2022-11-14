package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.domain.oidc.DynamicRegistrationInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DynamicRegistrationInfoRepository extends JpaRepository<DynamicRegistrationInfo, String> {
    List<DynamicRegistrationInfo> findAllByIdOfOwner(String idOfOwner);

    DynamicRegistrationInfo findByResourceId(String id);

    @Query(value = "SELECT dri FROM DynamicRegistrationInfo dri " +
                   " WHERE dri.idOfOwner IN (:groupIds)" +
                   "   AND dri.enabled = false" +
                   "   AND dri.approved = false")
    List<DynamicRegistrationInfo> getAllNeedingApproval(@Param("groupIds") List<String> groupIds);

    @Query(value = "SELECT dri FROM DynamicRegistrationInfo dri WHERE dri.enabled = false")
    List<DynamicRegistrationInfo> getDynamicRegistrationsNeedingEnabling();
}