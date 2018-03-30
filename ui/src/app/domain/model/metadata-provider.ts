import { Organization } from './organization';
import { MDUI } from './mdui';
import { Contact } from './contact';
import { SecurityInfo } from './security-info';
import { SsoService } from './sso-service';
import { LogoutEndpoint } from './logout-endpoint';
import { IdpSsoDescriptor } from './sso-descriptor';
import { RelyingPartyOverrides } from './relying-party-overrides';
import { Certificate } from './certificate';

import { MetadataBase } from './metadata-base';

export interface MetadataProvider extends MetadataBase {
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
    relyingPartyOverrides: RelyingPartyOverrides;
    attributeRelease: string[];
}

export * from './organization';
export * from './mdui';
export * from './contact';
export * from './security-info';
export * from './sso-service';
export * from './logout-endpoint';
export * from './sso-descriptor';
export * from './relying-party-overrides';
export * from './certificate';
