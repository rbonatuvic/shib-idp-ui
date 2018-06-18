import {
    Organization,
    Contact,
    MDUI,
    LogoutEndpoint,
    SecurityInfo,
    Certificate,
    SsoService,
    IdpSsoDescriptor,
    RelyingPartyOverrides,
    MetadataResolver
} from '../../model';
import { MetadataTypes } from '../../domain.type';
import { MetadataEntity } from '../../model/metadata-entity';

export class FileBackedHttpMetadataResolver implements MetadataResolver, MetadataEntity {
    id = '';
    createdDate?: string;
    modifiedDate?: string;
    version: string;

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

    constructor(descriptor?: Partial<MetadataResolver>) {
        Object.assign(this, descriptor);
    }

    getId(): string {
        return this.id ? this.id : this.entityId;
    }

    isDraft(): boolean {
        return this.id ? false : true;
    }

    get name(): string {
        return this.serviceProviderName;
    }

    get enabled(): boolean {
        return this.serviceEnabled;
    }

    get kind(): string {
        return MetadataTypes.RESOLVER;
    }

    serialize(): any {
        return this;
    }
}
