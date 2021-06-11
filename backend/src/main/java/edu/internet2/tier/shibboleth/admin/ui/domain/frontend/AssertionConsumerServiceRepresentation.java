package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssertionConsumerServiceRepresentation implements Serializable {
    private static final long serialVersionUID = 7610150456756113460L;

    private String locationUrl;

    private String binding;

    private boolean makeDefault;
    
    private Integer index;
}
