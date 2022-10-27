package edu.internet2.tier.shibboleth.admin.ui.security.repository;

import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownable;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Owner;
import edu.internet2.tier.shibboleth.admin.ui.security.model.Ownership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface OwnershipRepository extends JpaRepository<Ownership, String> {
    /**
     * Clear out anything owned by any group
     */
    @Query("DELETE FROM ownership o WHERE o.ownerType = 'GROUP'")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void clearAllOwnedByGroup();
    
    /**
     * Delete the user from any groups they may in.
     */
    @Query("DELETE FROM ownership o WHERE o.ownedId = :username AND o.ownedType = 'USER' AND o.ownerType = 'GROUP'")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void clearUsersGroups(@Param("username") String username);

    /**
     * Remove any ownership of the ownable object
     */
    @Query("DELETE FROM ownership o WHERE o.ownedId = :#{#ownedObject.getObjectId()} AND o.ownedType = :#{#ownedObject.getOwnableType().toString()}")
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    void deleteEntriesForOwnedObject(@Param("ownedObject") Ownable ownedObject);

    /**
     * Find all items an owner owns
     */
    @Query("SELECT o FROM ownership o WHERE o.ownerId = :#{#owner.getOwnerId()} AND o.ownerType = :#{#owner.getOwnerType().toString()}")
    Set<Ownership> findAllByOwner(@Param("owner") Owner owner);

    /**
     * Find all the groups that a user belongs to
     */
    @Query("SELECT o FROM ownership o WHERE o.ownedId = :username AND o.ownedType = 'USER' AND o.ownerType = 'GROUP' ")
    Set<Ownership> findAllGroupsForUser(@Param("username") String username);

    /**
     * Find the owner of this object
     */
    @Query("SELECT o FROM ownership o WHERE o.ownedId = :#{#ownedObject.getObjectId()} AND o.ownedType = :#{#ownedObject.getOwnableType().toString()}")
    Set<Ownership> findOwnableObjectOwners(@Param("ownedObject") Ownable ownedObject);

    /**
     * Find all things the user owns
     */
    @Query("SELECT o FROM ownership o WHERE o.ownerId = :username AND o.ownerType = 'USER' ")
    List<Ownership> findOwnedByUser(@Param("username") String username);

    /**
     * Find only the users that the owner owns
     */
    @Query("SELECT o FROM ownership o WHERE o.ownerId = :#{#owner.getOwnerId()} AND o.ownerType = :#{#owner.getOwnerType().toString()} AND o.ownedType='USER'")
    Set<Ownership> findUsersByOwner(@Param("owner") Owner owner);
}