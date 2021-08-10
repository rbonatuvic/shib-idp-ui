package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Id;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.ILazyLoaderHelper;
import lombok.Data;
import lombok.EqualsAndHashCode.Exclude;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EntityListeners(GroupUpdatedEntityListener.class)
@Entity(name = "user_groups")
public class Group implements Owner {
    @Transient
    @JsonIgnore
    public static Group ADMIN_GROUP;

    @Column(name = "group_description", nullable = true)
    String description;

    @Transient
    @JsonIgnore
    @Exclude
    private ILazyLoaderHelper lazyLoaderHelper;

    @Column(nullable = false)
    private String name;

    @Transient
    @JsonIgnore
    private Set<Ownership> ownedItems = new HashSet<>();

    @Id
    @Column(name = "resource_id")
    private String resourceId = UUID.randomUUID().toString();

    /**
     * Define a Group object based on the user
     */
    public Group(User user) {
        resourceId = user.getUsername();
        name = user.getUsername();
        description = "default user-group";
    }

    @Override
    public String getOwnerId() {
        return resourceId;
    }

    @Override
    public OwnerType getOwnerType() {
        return OwnerType.GROUP;
    }

    public void registerLoader(ILazyLoaderHelper lazyLoaderHelper) {
        this.lazyLoaderHelper = lazyLoaderHelper;
    }

    public Set<Ownership> getOwnedItems() {
        if (lazyLoaderHelper != null) {
            lazyLoaderHelper.loadOwnedItems(this);
        }
        return ownedItems;
    }
}
