export interface MetadataProvider {
    id?: string;
    entityId: string;
    serviceProviderName: string;
    organization?: Organization;
    contacts?: Contact[];
    mdui?: MDUI;
    securityInfo?: SecurityInfo;
    assertionConsumerServices?: SsoService[];
    serviceProviderSsoDescriptor?: IdpSsoDescriptor;

    logoutEndpoints?: LogoutEndpoint[];

    serviceEnabled?: boolean;

    createdDate?: string;
    modifiedDate?: string;

    relyingPartyOverrides: {
        signAssertion?: boolean;
        dontSignResponse?: boolean;
        turnOffEncryption?: boolean;
        useSha?: boolean;
        ignoreAuthenticationMethod?: boolean;
        omitNotBefore?: boolean;
        responderId?: string;
        nameIdFormats: string[];
        authenticationMethods: string[];
    };

    attributeRelease: string[];
}

export interface Organization {
    name?: string;
    displayName?: string;
    url?: string;
}

export interface Contact {
    type: string;
    name: string;
    emailAddress: string;
}

export interface MDUI {
    displayName?: string;
    informationUrl?: string;
    privacyStatementUrl?: string;
    logoUrl?: string;
    logoHeight?: number;
    logoWidth?: number;
    description?: string;
}

export interface LogoutEndpoint {
    url: string;
    bindingType: string;
}

export interface SecurityInfo {
    x509CertificateAvailable?: boolean;
    authenticationRequestsSigned?: boolean;
    wantAssertionsSigned?: boolean;
    x509Certificates: Certificate[];
}

export interface Certificate {
    name: string;
    type: string;
    value: string;
}

export interface SsoService {
    binding: string;
    locationUrl: string;
    makeDefault: boolean;
}

export interface IdpSsoDescriptor {
    protocolSupportEnum: string;
    nameIdFormats: string[];
}
