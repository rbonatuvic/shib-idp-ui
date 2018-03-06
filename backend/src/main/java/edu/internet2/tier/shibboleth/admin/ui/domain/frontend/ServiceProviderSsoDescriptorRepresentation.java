package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class ServiceProviderSsoDescriptorRepresentation implements Serializable {


    private static final long serialVersionUID = 8366502466924209389L;

    private String protocolSupportEnum;

    private List<String> nameIdFormats = new ArrayList<>();

    public String getProtocolSupportEnum() {
        return protocolSupportEnum;
    }

    public void setProtocolSupportEnum(String protocolSupportEnum) {
        this.protocolSupportEnum = protocolSupportEnum;
    }

    public List<String> getNameIdFormats() {
        return nameIdFormats;
    }

    public void setNameIdFormats(List<String> nameIdFormats) {
        this.nameIdFormats = nameIdFormats;
    }
}
