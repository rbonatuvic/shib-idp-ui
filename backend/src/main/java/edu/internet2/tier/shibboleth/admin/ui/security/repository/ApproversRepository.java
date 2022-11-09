package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApproversRepository extends JpaRepository<Approvers, String> {
    @Modifying
    @Query(nativeQuery = true, value="DELETE FROM approvers_user_groups WHERE approver_groups_resource_id IN (:ids)")
    void deleteGroupAssociationsForIds(@Param("ids") List<String> ids);

    Approvers findByResourceId(String resourceId);

    @Query(nativeQuery = true,
           value = "SELECT approvers_list_resource_id " +
                   "  FROM user_groups_approvers " +
                   " WHERE user_groups_resource_id = :resourceId")
    List<String> getApproverIdsForGroup(@Param("resourceId") String resourceId);
}