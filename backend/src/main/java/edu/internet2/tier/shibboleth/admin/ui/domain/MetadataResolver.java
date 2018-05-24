package edu.internet2.tier.shibboleth.admin.ui.domain;

import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@EqualsAndHashCode(callSuper = true)
public class MetadataResolver extends AbstractAuditable {
    private String name;
    private String resourceId = UUID.randomUUID().toString();

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<MetadataFilter> metadataFilters = new ArrayList<>();

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

    public List<MetadataFilter> getMetadataFilters() {
        return metadataFilters;
    }

    public void setMetadataFilters(List<MetadataFilter> metadataFilters) {
        this.metadataFilters = metadataFilters;
    }

    @Override
    public String toString() {
        return "MetadataResolver{\n" +
                "name='" + name + "\'\n" +
                ", resourceId='" + resourceId + "\'\n" +
                ", metadataFilters=\n" + metadataFilters +
                '}';
    }
}
