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
    name: string;
    '@type': string;
}
