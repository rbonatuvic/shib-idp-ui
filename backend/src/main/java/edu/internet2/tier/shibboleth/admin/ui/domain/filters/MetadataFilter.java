package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.ActivatableType;
import edu.internet2.tier.shibboleth.admin.ui.domain.IActivatable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.AuditOverride;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Transient;
import java.util.UUID;

import static edu.internet2.tier.shibboleth.admin.ui.domain.ActivatableType.FILTER;

/**
 * Domain class to store information about {@link org.opensaml.saml.metadata.resolver.filter.MetadataFilter}
 */
@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@EqualsAndHashCode(callSuper = true, exclude={"version", "type"})
@NoArgsConstructor
@Getter
@Setter
@ToString
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "@type", visible = true)
@JsonSubTypes({@JsonSubTypes.Type(value=EntityRoleWhiteListFilter.class, name="EntityRoleWhiteList"),
        @JsonSubTypes.Type(value=EntityAttributesFilter.class, name="EntityAttributes"),
        @JsonSubTypes.Type(value=SignatureValidationFilter.class, name="SignatureValidation"),
        @JsonSubTypes.Type(value=RequiredValidUntilFilter.class, name="RequiredValidUntil"),
        @JsonSubTypes.Type(value=NameIdFormatFilter.class, name="NameIDFormat"),
        @JsonSubTypes.Type(value=AlgorithmFilter.class, name="Algorithm")})
@Audited
@AuditOverride(forClass = AbstractAuditable.class)
public abstract class MetadataFilter extends AbstractAuditable implements IConcreteMetadataFilterType<MetadataFilter>, IActivatable {

    private boolean filterEnabled;

    private String name;

    @Column(unique=true)
    private String resourceId = UUID.randomUUID().toString();

    @JsonProperty("@type")
    @Transient
    protected String type;

    @Transient
    private transient Integer version;

    @JsonIgnore
    public ActivatableType getActivatableType() {
        return FILTER;
    }

    @JsonGetter("version")
    public int getVersion() {
        if (version != null && version != 0) {
            return this.version;
        }
        return this.hashCode();
    }

    public void setEnabled(Boolean serviceEnabled) {
        this.filterEnabled = (serviceEnabled == null) ? false : serviceEnabled;
    }
}