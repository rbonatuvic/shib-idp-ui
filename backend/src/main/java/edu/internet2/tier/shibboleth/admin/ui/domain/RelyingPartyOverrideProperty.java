package edu.internet2.tier.shibboleth.admin.ui.domain;

import java.util.Set;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Bill Smith (wsmith@unicon.net)
 */
@Setter
@Getter
@ToString
public class RelyingPartyOverrideProperty implements IRelyingPartyOverrideProperty {
    private String attributeFriendlyName;
    private String attributeName;
    private String defaultValue;
    private Set<String> defaultValues;
    private String displayName;
    private String displayType;
    private String helpText;
    private String invert;
    private String name;
    private String persistType;
    private String persistValue;
}