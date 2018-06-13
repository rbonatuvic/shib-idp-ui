import {
    MetadataBase,
    Organization,
    Contact,
    MDUI,
    SecurityInfo,
    SsoService,
    IdpSsoDescriptor,
    LogoutEndpoint,
    RelyingPartyOverrides
} from '../model';

export interface MetadataProvider extends MetadataBase {
    serviceProviderName: string;
    organization?: Organization;
    contacts?: Contact[];
    mdui?: MDUI;
    securityInfo?: SecurityInfo;
    assertionConsumerServices?: SsoService[];
    serviceProviderSsoDescriptor?: IdpSsoDescriptor;
    logoutEndpoints?: LogoutEndpoint[];
    serviceEnabled?: boolean;
    relyingPartyOverrides: RelyingPartyOverrides;
    attributeRelease: string[];
}
