package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GroupsRepository extends JpaRepository<Group, String> {
    @Modifying
    @Query(nativeQuery = true,
           value = "DELETE user_groups_approvers " +
                   " WHERE approvers_list_resource_id IN (SELECT approvers_list_resource_id " +
                   "                                        FROM user_group_approvers " +
                   "                                       WHERE user_groups_resource_id = :resourceId)")
    void clearApproversForGroup(@Param("resourceId") String resourceId);

    void deleteByResourceId(String resourceId);

    Group findByResourceId(String id);

    @Query(nativeQuery = true, value = "SELECT resource_id FROM user_groups")
    List<String> findAllGroupIds();

    @Query(nativeQuery = true,
           value = "SELECT DISTINCT user_groups_resource_id " +
                           "  FROM user_groups_approvers " +
                           " WHERE approvers_list_resource_id IN (SELECT approvers_resource_id " +
                           "                                        FROM approvers_user_groups " +
                           "                                       WHERE approver_groups_resource_id = :resourceId)")
    List<String> getGroupIdsOfGroupsToApproveFor(@Param("resourceId") String resourceId);
}