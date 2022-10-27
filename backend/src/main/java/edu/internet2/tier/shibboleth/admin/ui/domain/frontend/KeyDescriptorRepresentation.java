package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
public class KeyDescriptorRepresentation implements Serializable {
    private static final long serialVersionUID = -2397547851045884034L;

    private String name;
    private String value;
    private String type;
    private ElementType elementType;

    public enum ElementType {
        jwksData, jwksUri, clientSecret, clientSecretRef, X509Data, unsupported
    }
}