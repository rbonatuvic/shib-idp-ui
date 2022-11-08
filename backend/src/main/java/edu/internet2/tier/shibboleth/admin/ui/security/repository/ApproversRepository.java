package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Approvers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApproversRepository extends JpaRepository<Approvers, String> {
    Approvers findByResourceId(String resourceId);

    @Query(nativeQuery = true,
           value = "SELECT resource_id FROM approvers WHERE resource_id IN (SELECT approvers_resource_id " +
                   "                                                          FROM approvers_user_groups " +
                   "                                                         WHERE approver_groups_resource_id = :resourceId)")
    List<String> getApproverIdsForGroup(@Param("resourceId") String resourceId);
}