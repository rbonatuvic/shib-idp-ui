import {
    MetadataProvider,
    Contact,
    SsoService,
    Certificate,
    SecurityInfo,
    LogoutEndpoint
} from '../app/domain/model/metadata-provider';

export const draft = {
    entityId: 'foo',
    serviceProviderName: 'bar'
} as MetadataProvider;

export const provider = {
    ...draft,
    id: '1'
} as MetadataProvider;

export const contact = {
    type: 'support',
    name: 'hithere yo',
    emailAddress: 'somewhere@something.com'
} as Contact;

export const endpoint = {
    binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    locationUrl: 'http://unicon.net/location',
    makeDefault: false
} as SsoService;

export const certificate = {
    name: 'foo',
    type: 'signing',
    value: 'xyz'
} as Certificate;

export const secInfo = {
    x509CertificateAvailable: false,
    authenticationRequestsSigned: true,
    wantAssertionsSigned: true,
    x509Certificates: []
} as SecurityInfo;

export const logoutEndpoint = {
    url: 'foo',
    bindingType: 'bar'
} as LogoutEndpoint;
