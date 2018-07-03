package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
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
@Getter
@Setter
@ToString
public class DynamicHttpMetadataResolver extends MetadataResolver {



    public static final String DEFAULT_TIMEOUT = "PT5S";

    @Embedded
    private DynamicMetadataResolverAttributes dynamicMetadataResolverAttributes;

    @Embedded
    private HttpMetadataResolverAttributes httpMetadataResolverAttributes;

    private Integer maxConnectionsTotal = 100;

    private Integer maxConnectionsPerRoute = 100;

    @ElementCollection
    @OrderColumn
    private List<String> supportedContentTypes;

    public DynamicHttpMetadataResolver() {
        type = "DynamicHttpMetadataResolver";
        this.httpMetadataResolverAttributes = new HttpMetadataResolverAttributes();
        this.httpMetadataResolverAttributes.setConnectionRequestTimeout(DEFAULT_TIMEOUT);
        this.httpMetadataResolverAttributes.setConnectionTimeout(DEFAULT_TIMEOUT);
        this.httpMetadataResolverAttributes.setSocketTimeout(DEFAULT_TIMEOUT);
        this.dynamicMetadataResolverAttributes = new DynamicMetadataResolverAttributes();
    }
}
