package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ServiceProviderSsoDescriptorRepresentation implements Serializable {
    private static final long serialVersionUID = 8366502466924209389L;

    private String protocolSupportEnum;

    private List<String> nameIdFormats = new ArrayList<>();

    private Map<String,Object> extensions = new HashMap<>();

    public void addExtensions(String name, Map<String, Object> value) {
        extensions.put(name, value);
    }
}