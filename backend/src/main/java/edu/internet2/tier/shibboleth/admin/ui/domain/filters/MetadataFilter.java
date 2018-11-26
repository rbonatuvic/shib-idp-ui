package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Transient;
import java.util.UUID;

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
        @JsonSubTypes.Type(value=NameIdFormatFilter.class, name="NameIDFormat")})
public class MetadataFilter extends AbstractAuditable {

    @JsonProperty("@type")
    @Transient
    String type;

    private String name;

    @Column(unique=true)
    private String resourceId = UUID.randomUUID().toString();

    private boolean filterEnabled;

    @Transient
    private transient Integer version;

    @JsonGetter("version")
    public int getVersion() {
        if (version != null && version != 0) {
            return this.version;
        }
        return this.hashCode();
    }
}