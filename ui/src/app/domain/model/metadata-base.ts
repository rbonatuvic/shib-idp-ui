import { Organization } from './organization';
import { MDUI } from './mdui';
import { Contact } from './contact';
import { SecurityInfo } from './security-info';
import { SsoService, LogoutEndpoint } from '../../domain/model/metadata-provider';
import { IdpSsoDescriptor } from './sso-descriptor';
import { RelyingPartyOverrides } from './relying-party-overrides';

export interface MetadataBase {
    id?: string;
    createdDate?: string;
    modifiedDate?: string;
    version: string;

    name: string;
    enabled: boolean;
    type: string;

    serialize(): any;
}
