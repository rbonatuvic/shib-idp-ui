package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class RelyingPartyOverridesRepresentation implements Serializable {

    private static final long serialVersionUID = 2439457246884861580L;

    private boolean signAssertion;

    private boolean dontSignResponse;

    private boolean turnOffEncryption;

    private boolean useSha;

    private boolean ignoreAuthenticationMethod;

    private boolean omitNotBefore;

    private String responderId;

    private List<String> nameIdFormats = new ArrayList<>();

    private List<String> authenticationMethods = new ArrayList<>();

    private boolean forceAuthn;

    public boolean isSignAssertion() {
        return signAssertion;
    }

    public void setSignAssertion(boolean signAssertion) {
        this.signAssertion = signAssertion;
    }

    public boolean isDontSignResponse() {
        return dontSignResponse;
    }

    public void setDontSignResponse(boolean dontSignResponse) {
        this.dontSignResponse = dontSignResponse;
    }

    public boolean isTurnOffEncryption() {
        return turnOffEncryption;
    }

    public void setTurnOffEncryption(boolean turnOffEncryption) {
        this.turnOffEncryption = turnOffEncryption;
    }

    public boolean isUseSha() {
        return useSha;
    }

    public void setUseSha(boolean useSha) {
        this.useSha = useSha;
    }

    public boolean isIgnoreAuthenticationMethod() {
        return ignoreAuthenticationMethod;
    }

    public void setIgnoreAuthenticationMethod(boolean ignoreAuthenticationMethod) {
        this.ignoreAuthenticationMethod = ignoreAuthenticationMethod;
    }

    public boolean isOmitNotBefore() {
        return omitNotBefore;
    }

    public void setOmitNotBefore(boolean omitNotBefore) {
        this.omitNotBefore = omitNotBefore;
    }

    public String getResponderId() {
        return responderId;
    }

    public void setResponderId(String responderId) {
        this.responderId = responderId;
    }

    public List<String> getNameIdFormats() {
        return nameIdFormats;
    }

    public void setNameIdFormats(List<String> nameIdFormats) {
        this.nameIdFormats = nameIdFormats;
    }

    public List<String> getAuthenticationMethods() {
        return authenticationMethods;
    }

    public void setAuthenticationMethods(List<String> authenticationMethods) {
        this.authenticationMethods = authenticationMethods;
    }

    public boolean isForceAuthn() {
        return forceAuthn;
    }

    public void setForceAuthn(boolean forceAuthn) {
        this.forceAuthn = forceAuthn;
    }
}
