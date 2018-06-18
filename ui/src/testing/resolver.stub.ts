import {
    MetadataProvider,
    Contact,
    SsoService,
    Certificate,
    SecurityInfo,
    LogoutEndpoint,
    MetadataResolver
} from '../app/metadata/domain/model';

export const draft = {
    entityId: 'foo',
    serviceProviderName: 'bar'
} as MetadataResolver;

export const resolver = {
    ...draft,
    id: '1'
} as MetadataResolver;

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
