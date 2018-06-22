package edu.internet2.tier.shibboleth.admin.ui.domain.filters;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;

@Entity
@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@ToString
public class RequiredValidUntilFilter extends MetadataFilter {

    public RequiredValidUntilFilter() {
        type = "RequiredValidUntil";
    }

    private String maxValidityInterval;
}
