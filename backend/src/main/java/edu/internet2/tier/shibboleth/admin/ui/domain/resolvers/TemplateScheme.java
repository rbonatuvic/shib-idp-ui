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
public class TemplateScheme extends MetadataRequestURLConstructionScheme {

    public TemplateScheme () {
        type = "Template";
    }

    public enum EncodingStyle {
        NONE, FORM, PATH, FRAGMENT
    }

    private EncodingStyle encodingStyle = EncodingStyle.FORM;

    private String transformRef;

    private String velocityEngine = "shibboleth.VelocityEngine";
}
