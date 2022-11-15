package edu.internet2.tier.shibboleth.admin.ui.security.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.GroupUpdatedEntityListener;
import edu.internet2.tier.shibboleth.admin.ui.security.model.listener.ILazyLoaderHelper;
import lombok.Data;
import lombok.EqualsAndHashCode.Exclude;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@NoArgsConstructor
@EntityListeners(GroupUpdatedEntityListener.class)
@Entity(name = "user_groups")
public class Group implements Owner {
    public static final String DEFAULT_REGEX = "/(?!^()$)^(.*)$/"; //everything except an empty string

    @Transient
    @JsonIgnore
    public static Group ADMIN_GROUP;

    @Transient
    @JsonIgnore
    List<String> approveForList = new ArrayList<>();

    @Column(name = "group_description")
    String description;

    @Transient
    @JsonIgnore
    @Exclude
    private ILazyLoaderHelper lazyLoaderHelper;

    @Column(name = "name", nullable = false)
    private String name;

    @Transient
    @JsonIgnore
    private Set<Ownership> ownedItems = new HashSet<>();

    @Id
    @Column(name = "resource_id")
    private String resourceId = UUID.randomUUID().toString();

    @Column(name = "validation_regex")
    private String validationRegex;

    @OneToMany(fetch = FetchType.EAGER)
    private List<Approvers> approversList = new ArrayList<>();

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

    @Override
    public int hashCode() {
        return resourceId.hashCode();
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof Group && this.resourceId.equals(((Group)o).resourceId);
    }

    public List<String> getApproveForList() {
        if (lazyLoaderHelper != null) {
            lazyLoaderHelper.loadApproveForList(this);
        }
        return approveForList;
    }

    @Override
    public String toString() {
        return "Group resourceId=" + resourceId;
    }
}