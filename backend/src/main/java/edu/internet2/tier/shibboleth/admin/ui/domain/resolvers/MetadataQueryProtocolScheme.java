package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class MetadataQueryProtocolScheme extends MetadataRequestURLConstructionScheme {

    public MetadataQueryProtocolScheme() {
        type = "MetadataQueryProtocol";
    }

    private String transformRef;
}
