package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

public class OrganizationRepresentation implements Serializable {

    private static final long serialVersionUID = 802722455433573538L;

    private String name;

    private String displayName;

    private String url;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
