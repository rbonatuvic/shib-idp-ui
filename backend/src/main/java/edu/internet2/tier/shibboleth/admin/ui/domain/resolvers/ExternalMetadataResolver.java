package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
@Audited
public class ExternalMetadataResolver extends MetadataResolver {
    @Column
    private String description;

    @Column
    String name;

    public ExternalMetadataResolver() {
        type = "ExternalMetadataResolver";
    }
}