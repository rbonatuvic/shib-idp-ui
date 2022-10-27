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
    private List<KeyDescriptorRepresentation> keyDescriptors = new ArrayList<>();

    public void addKeyDescriptor(KeyDescriptorRepresentation keyDescriptorRep) {
        keyDescriptors.add(keyDescriptorRep);
    }

}