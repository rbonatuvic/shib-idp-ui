import {
    MetadataProvider,
    Organization,
    Contact,
    MDUI,
    LogoutEndpoint,
    SecurityInfo,
    Certificate,
    SsoService,
    IdpSsoDescriptor
} from './metadata-provider';

export class EntityDescriptor implements MetadataProvider {
    id = '';
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

    createdDate?: string;
    modifiedDate?: string;

    relyingPartyOverrides = {
        nameIdFormats: [] as string[],
        authenticationMethods: [] as string[]
    };

    attributeRelease = [] as string[];

    constructor(descriptor?: Partial<MetadataProvider>) {
        Object.assign(this, descriptor);
    }
}
