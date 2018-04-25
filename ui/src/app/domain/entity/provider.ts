import {
    MetadataProvider,
    Organization,
    Contact,
    MDUI,
    LogoutEndpoint,
    SecurityInfo,
    Certificate,
    SsoService,
    IdpSsoDescriptor,
    RelyingPartyOverrides
} from '../model/metadata-provider';
import { DomainTypes } from '../domain.type';

export class Provider implements MetadataProvider {
    id = '';
    createdDate?: string;
    modifiedDate?: string;

    entityId = '';
    serviceProviderName = '';
    organization = {} as Organization;
    contacts = [] as Contact[];
    mdui = {} as MDUI;

    securityInfo = {
        x509CertificateAvailable: false,
        authenticationRequestsSigned: false,
        wantAssertionsSigned: false,
        x509Certificates: [] as Certificate[]
    } as SecurityInfo;

    assertionConsumerServices = [] as SsoService[];
    serviceProviderSsoDescriptor = {
        nameIdFormats: []
    } as IdpSsoDescriptor;

    logoutEndpoints = [] as LogoutEndpoint[];

    serviceEnabled = false;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    } as RelyingPartyOverrides;

    attributeRelease = [] as string[];

    constructor(descriptor?: Partial<MetadataProvider>) {
        Object.assign(this, descriptor);
    }

    get name(): string {
        return this.serviceProviderName;
    }

    get enabled(): boolean {
        return this.serviceEnabled;
    }

    get type(): string {
        return DomainTypes.provider;
    }

    serialize(): any {
        return this;
    }
}
