package edu.internet2.tier.shibboleth.admin.ui.envers;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.DefaultTrackingModifiedEntitiesRevisionEntity;
import org.hibernate.envers.RevisionEntity;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * Extension of the default envers revision entity to track authenticated principals
 */
@Entity
@RevisionEntity(PrincipalEnhancingRevisionListener.class)
@Table(name = "REVINFO")
@Getter
@Setter
public class PrincipalAwareRevisionEntity extends DefaultTrackingModifiedEntitiesRevisionEntity {

    private String principalUserName;

    public String idAsString() {
        return String.valueOf(getId());
    }
}
