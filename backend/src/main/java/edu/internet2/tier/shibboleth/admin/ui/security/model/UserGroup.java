package edu.internet2.tier.shibboleth.admin.ui.security.model;

import javax.persistence.CascadeType;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;

import lombok.Data;

@Entity
@Data
public class UserGroup {
    public UserGroup() {
    }
    
    public UserGroup(Group group, User user) {
        this.group = group;
        this.user = user;
    }

    @EmbeddedId
    UserGroupKey id = new UserGroupKey();
    
    @ManyToOne
    @MapsId("resourceId")
    @JoinColumn(name = "resource_id")
    Group group;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    User user;
}
