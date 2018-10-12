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
    resourceId = '';
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

    logoutEndpoints: LogoutEndpoint[] = [];

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
        return this.resourceId;
    }

    getDisplayId(): string {
        return this.entityId;
    }

    isDraft(): boolean {
        return this.createdDate ? false : true;
    }

    getCreationDate(): Date {
        return new Date(this.createdDate);
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
