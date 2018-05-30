package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

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
@EqualsAndHashCode(callSuper = true, exclude={"version"})
@NoArgsConstructor
@Getter
@Setter
@ToString
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({@JsonSubTypes.Type(value=EntityRoleWhiteListFilter.class, name="EntityRoleWhiteList")})
public class MetadataFilter extends AbstractAuditable {

    private String name;

    @Column(unique=true)
    private String resourceId = UUID.randomUUID().toString();

    private boolean filterEnabled;

    @Transient
    private int version;
}
