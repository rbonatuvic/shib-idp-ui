package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import java.util.UUID;

/**
 * Domain class to store information about {@link org.opensaml.saml.metadata.resolver.filter.MetadataFilter}
 */
@Entity
@EqualsAndHashCode(callSuper = true)
public class MetadataFilter extends AbstractAuditable {
    private String name;
    @Column(unique=true)
    private String resourceId = UUID.randomUUID().toString();
    private boolean filterEnabled;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public boolean isFilterEnabled() {
        return filterEnabled;
    }

    public void setFilterEnabled(boolean filterEnabled) {
        this.filterEnabled = filterEnabled;
    }
}
