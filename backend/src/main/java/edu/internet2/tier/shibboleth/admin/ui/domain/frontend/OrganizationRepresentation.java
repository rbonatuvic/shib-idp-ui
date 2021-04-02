package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;

public class OrganizationRepresentation implements Serializable {

    private static final long serialVersionUID = 802722455433573538L;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String name;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String displayName;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
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
