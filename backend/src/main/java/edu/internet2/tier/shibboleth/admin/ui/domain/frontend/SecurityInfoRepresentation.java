package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class SecurityInfoRepresentation implements Serializable {
    private static final long serialVersionUID = 9016350010045719454L;

    private boolean authenticationRequestsSigned;
    private boolean wantAssertionsSigned;
    private List<X509CertificateRepresentation> x509Certificates = new ArrayList<>();
    private List<KeyDescriptorRepresentation> keyDescriptors = new ArrayList<>();

    public void addKeyDescriptor(KeyDescriptorRepresentation keyDescriptorRep) {
        keyDescriptors.add(keyDescriptorRep);
    }

    @Getter
    @Setter
    @Deprecated
    public static class X509CertificateRepresentation implements Serializable {
        private static final long serialVersionUID = -4893206348572998788L;

        private String name;
        private String value;
        //TODO refactor into Enum?
        private String type;
    }
}