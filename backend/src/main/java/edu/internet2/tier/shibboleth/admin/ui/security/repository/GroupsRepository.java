package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GroupsRepository extends JpaRepository<Group, String> {
    void deleteByResourceId(String resourceId);

    Group findByResourceId(String id);

    @Query(nativeQuery = true,
           value = "SELECT DISTINCT user_groups_resource_id " +
                   "  FROM user_groups_approvers " +
                   " WHERE approvers_list_resource_id IN (SELECT approvers_resource_id " +
                   "                                        FROM approvers_user_groups " +
                   "                                       WHERE approver_groups_resource_id = :resourceId)")
    List<String> getGroupIdsOfGroupsToApproveFor(@Param("resourceId") String resourceId);

    @Query(nativeQuery = true, value = "SELECT resource_id FROM user_groups")
    List<String> findAllGroupIds();
}