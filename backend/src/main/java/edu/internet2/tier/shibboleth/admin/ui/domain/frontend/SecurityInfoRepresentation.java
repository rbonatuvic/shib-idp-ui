package edu.internet2.tier.shibboleth.admin.ui.domain.frontend;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class SecurityInfoRepresentation implements Serializable {

    private static final long serialVersionUID = 9016350010045719454L;

    private boolean x509CertificateAvailable;

    private boolean authenticationRequestsSigned;

    private boolean wantAssertionsSigned;

    private List<X509CertificateRepresentation> x509Certificates = new ArrayList<>();

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

    public boolean isWantAssertionsSigned() {
        return wantAssertionsSigned;
    }

    public void setWantAssertionsSigned(boolean wantAssertionsSigned) {
        this.wantAssertionsSigned = wantAssertionsSigned;
    }

    public List<X509CertificateRepresentation> getX509Certificates() {
        return x509Certificates;
    }

    public void setX509Certificates(List<X509CertificateRepresentation> x509Certificates) {
        this.x509Certificates = x509Certificates;
    }

    public static class X509CertificateRepresentation implements Serializable {

        private static final long serialVersionUID = -4893206348572998788L;

        private String name;

        //TODO refactor into Enum?
        private String type;

        private String value;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }
    }
}
