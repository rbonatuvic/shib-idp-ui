package edu.internet2.tier.shibboleth.admin.ui.domain.resolvers;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.envers.Audited;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@Audited
public class RegexScheme extends MetadataRequestURLConstructionScheme {

    public RegexScheme() {
        type = "Regex";
    }

    @NotNull
    @Column(name = "match_regex")
    private String match;
}
