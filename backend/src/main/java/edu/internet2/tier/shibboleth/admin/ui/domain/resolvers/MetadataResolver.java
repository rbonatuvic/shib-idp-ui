package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.EntityAttributesFilter;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.OneToMany;
import javax.persistence.OrderColumn;
import javax.persistence.Transient;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.stream.Collectors.toList;

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@EqualsAndHashCode(callSuper = true, exclude = {"version"})
@NoArgsConstructor
@Getter
@Setter
@ToString
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "@type", visible = true)
@JsonSubTypes({@JsonSubTypes.Type(value = LocalDynamicMetadataResolver.class, name = "LocalDynamicMetadataResolver"),
        @JsonSubTypes.Type(value = FileBackedHttpMetadataResolver.class, name = "FileBackedHttpMetadataResolver"),
        @JsonSubTypes.Type(value = DynamicHttpMetadataResolver.class, name = "DynamicHttpMetadataResolver"),
        @JsonSubTypes.Type(value = FilesystemMetadataResolver.class, name = "FilesystemMetadataResolver"),
        @JsonSubTypes.Type(value = ResourceBackedMetadataResolver.class, name = "ResourceBackedMetadataResolver")})
public class MetadataResolver extends AbstractAuditable {

    @JsonProperty("@type")
    @Transient
    String type = "BaseMetadataResolver";

    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String resourceId = UUID.randomUUID().toString();

    private Boolean requireValidMetadata = true;

    private Boolean failFastInitialization = true;

    private Integer sortKey;

    private String criterionPredicateRegistryRef;

    private Boolean useDefaultPredicateRegistry = true;

    private Boolean satisfyAnyPredicates = false;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<MetadataFilter> metadataFilters = new ArrayList<>();

    @Transient
    private int version;

    public void updateVersion() {
        this.version = hashCode();
    }

    public void convertFiltersIntoTransientRepresentationIfNecessary() {
        getAvailableEntityAttributesFilters().forEach(EntityAttributesFilter::intoTransientRepresentation);
    }

    public void convertFiltersFromTransientRepresentationIfNecessary() {
        getAvailableEntityAttributesFilters().forEach(EntityAttributesFilter::fromTransientRepresentation);
    }

    private List<EntityAttributesFilter> getAvailableEntityAttributesFilters() {
        return this.metadataFilters.stream()
                .filter(EntityAttributesFilter.class::isInstance)
                .map(EntityAttributesFilter.class::cast)
                .collect(toList());
    }
}
