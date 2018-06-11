package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import edu.internet2.tier.shibboleth.admin.ui.domain.MetadataFilter;
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

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@EqualsAndHashCode(callSuper = true, exclude={"version"})
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MetadataResolver extends AbstractAuditable {

    @Column(unique=true)
    private String name;

    @Column(unique=true)
    private String resourceId = UUID.randomUUID().toString();

    private Boolean requireValidMetadata = true;

    private Boolean failFastInitialization = true;

    private Integer sortKey;

    private String criterionPredicateRegistryRef;

    private Boolean useDefaultPredicateRegistry = true;

    private Boolean satisfyAnyPredicates;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderColumn
    private List<MetadataFilter> metadataFilters = new ArrayList<>();

    @Transient
    private int version;
}
