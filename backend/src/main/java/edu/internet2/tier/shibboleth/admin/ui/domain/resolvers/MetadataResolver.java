package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.filters.MetadataFilter;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

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

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@EqualsAndHashCode(callSuper = true, exclude = {"version", "versionModifiedTimestamp"})
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
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
public class MetadataResolver extends AbstractAuditable {

    @JsonProperty("@type")
    @Transient
    String type = "BaseMetadataResolver";

    @Column(unique = true)
    private String name;

    @Column(unique = true)
    private String resourceId = UUID.randomUUID().toString();

    @Column(unique = true)
    private String xmlId;

    private Boolean enabled = true;

    private Boolean requireValidMetadata = true;

    private Boolean failFastInitialization = true;

    private Integer sortKey;

    private String criterionPredicateRegistryRef;

    private Boolean useDefaultPredicateRegistry = true;

    private Boolean satisfyAnyPredicates = false;

    private Boolean doInitialization = true;

    @JsonIgnore
    private Long versionModifiedTimestamp;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<MetadataFilter> metadataFilters = new ArrayList<>();

    @Transient
    private Integer version;

    @JsonGetter("version")
    public int getVersion() {
        if (this.version != null && this.version != 0 ) {
            return this.version;
        }
        return this.hashCode();
    }

    public void markAsModified() {
        this.versionModifiedTimestamp = System.currentTimeMillis();
    }
}
