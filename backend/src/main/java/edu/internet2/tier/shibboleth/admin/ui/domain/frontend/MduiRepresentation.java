package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

public class MduiRepresentation implements Serializable {

    private static final long serialVersionUID = -3691809604832660384L;

    private String displayName;

    private String informationUrl;

    private String privacyStatementUrl;

    private String description;

    private String logoUrl;

    private int logoHeight;

    private int logoWidth;

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getInformationUrl() {
        return informationUrl;
    }

    public void setInformationUrl(String informationUrl) {
        this.informationUrl = informationUrl;
    }

    public String getPrivacyStatementUrl() {
        return privacyStatementUrl;
    }

    public void setPrivacyStatementUrl(String privacyStatementUrl) {
        this.privacyStatementUrl = privacyStatementUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public int getLogoHeight() {
        return logoHeight;
    }

    public void setLogoHeight(int logoHeight) {
        this.logoHeight = logoHeight;
    }

    public int getLogoWidth() {
        return logoWidth;
    }

    public void setLogoWidth(int logoWidth) {
        this.logoWidth = logoWidth;
    }
}
