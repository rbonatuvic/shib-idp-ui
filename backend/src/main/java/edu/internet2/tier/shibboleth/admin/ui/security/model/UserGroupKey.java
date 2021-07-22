package edu.internet2.tier.shibboleth.admin.ui.security.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import lombok.Data;

@Embeddable
@Data
public class UserGroupKey implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Column(name = "group_resource_id")
    private String resourceId;
    
    @Column(name = "user_id")
    private long userId;
}
