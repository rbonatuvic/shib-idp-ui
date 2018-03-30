import { Certificate } from './certificate';

export interface SecurityInfo {
    x509CertificateAvailable?: boolean;
    authenticationRequestsSigned?: boolean;
    wantAssertionsSigned?: boolean;
    x509Certificates: Certificate[];
}
