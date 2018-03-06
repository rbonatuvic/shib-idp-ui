package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;

public class KeyDescriptorRepresentation implements Serializable {

    private static final long serialVersionUID = -2397547851045884034L;

    private boolean x509CertificateAvailable;

    private boolean authenticationRequestsSigned;

    private String x509Certificate;

    public boolean isX509CertificateAvailable() {
        return x509CertificateAvailable;
    }

    public void setX509CertificateAvailable(boolean x509CertificateAvailable) {
        this.x509CertificateAvailable = x509CertificateAvailable;
    }

    public boolean isAuthenticationRequestsSigned() {
        return authenticationRequestsSigned;
    }

    public void setAuthenticationRequestsSigned(boolean authenticationRequestsSigned) {
        this.authenticationRequestsSigned = authenticationRequestsSigned;
    }

    public String getX509Certificate() {
        return x509Certificate;
    }

    public void setX509Certificate(String x509Certificate) {
        this.x509Certificate = x509Certificate;
    }
}
