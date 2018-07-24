package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import edu.internet2.tier.shibboleth.admin.ui.domain.AbstractAuditable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OrderColumn;
import java.util.ArrayList;
import java.util.List;

/**
 * This is a persistent entity abstraction encapsulating a collection of metadata resolver ids
 * for the purpose of maintaining an order of all persistent metadata resolvers which becomes significant during
 * generation of XML metadata for the resolvers.
 *
 * Maintaining this separate entity enables UI layer for example to explicitly manipulate ordering e.g. use REST
 * API to reorder resolvers, etc.
 *
 * @author Dmitriy Kopylenko
 */
@Entity
@EqualsAndHashCode
@NoArgsConstructor
@Getter
@Setter
@ToString
public class MetadataResolversPositionOrderContainer extends AbstractAuditable {

    @ElementCollection
    @CollectionTable(name="METADATA_RESOLVER_POSITION_ORDER", joinColumns=@JoinColumn(name="METADATA_RESOLVER_POSITION_ORDER_CONTAINER_ID"))
    @Column(name="METADATA_RESOLVER_RESOURCE_ID")
    @OrderColumn
    private List<String> resourceIds = new ArrayList<>();
}
