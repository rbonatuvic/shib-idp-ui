package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.ElementCollection;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.OrderColumn;
import java.util.List;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@Getter
@Setter
@ToString
public class DynamicHttpMetadataResolver extends MetadataResolver {

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;

    @Embedded
    private HttpMetadataResolverAttributes httpMetadataResolverAttributes;

    private int maxConnectionsTotal;

    private int maxConnectionsPerRoute;

    @ElementCollection
    @OrderColumn
    private List<String> supportedContentTypes;
}
