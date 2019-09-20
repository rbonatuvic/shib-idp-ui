import { FileBackedHttpMetadataResolver } from './file-backed-http-metadata-resolver';
import { MetadataResolver } from '../../model';

describe('Resolver construct', () => {

    const config = {
        id: 'foo',
        entityId: 'string',
        serviceProviderName: 'string',
        organization: {
            'name': 'string',
            'displayName': 'string',
            'url': 'string'
        },
        contacts: [
            {
                'name': 'string',
                'type': 'string',
                'emailAddress': 'string'
            }
        ],
        mdui: {
            'displayName': 'string',
            'informationUrl': 'string',
            'privacyStatementUrl': 'string',
            'logoUrl': 'string',
            'logoHeight': 100,
            'logoWidth': 100,
            'description': 'string'
        },
        securityInfo: {
            'x509CertificateAvailable': true,
            'authenticationRequestsSigned': true,
            'wantAssertionsSigned': true,
            'x509Certificates': [
                {
                    'name': 'string',
                    'type': 'string',
                    'value': 'string'
                }
            ]
        },
        assertionConsumerServices: [
            {
                'binding': 'string',
                'locationUrl': 'string',
                'makeDefault': true
            }
        ],
        serviceProviderSsoDescriptor: {
            'protocolSupportEnum': 'string',
            'nameIdFormats': [
                'string'
            ]
        },

        logoutEndpoints: [
            {
                'url': 'string',
                'bindingType': 'string'
            }
        ],
        serviceEnabled: true,
        createdDate: 'December 17, 1995 03:24:00',
        modifiedDate: 'December 17, 1995 03:24:00',
        relyingPartyOverrides: {
            'signAssertion': true,
            'dontSignResponse': true,
            'turnOffEncryption': true,
            'useSha': true,
            'ignoreAuthenticationMethod': true,
            'omitNotBefore': true,
            'responderId': 'string',
            'nameIdFormats': [
                'string'
            ],
            'authenticationMethods': [
                'string'
            ]
        },
        attributeRelease: [
            'eduPersonPrincipalName',
            'uid',
            'mail'
        ]
    };

    it('should populate its own values', () => {
        const entity = new FileBackedHttpMetadataResolver(config);
        Object.keys(config).forEach(key => {
            expect(entity[key]).toEqual(config[key]);
        });
    });

    describe('isDraft method', () => {
        it('should return false if no createDate defined', () => {
            const entity = new FileBackedHttpMetadataResolver(config);
            expect(entity.isDraft()).toBe(false);
        });

        it('should return false if no createDate defined', () => {
            const { createdDate, ...rest } = config;
            const entity = new FileBackedHttpMetadataResolver(rest as MetadataResolver);
            expect(entity.isDraft()).toBe(true);
        });
    });

    describe('getCreationDate method', () => {
        it('should return false if no createDate defined', () => {
            const entity = new FileBackedHttpMetadataResolver(config);
            expect(entity.getCreationDate()).toBeDefined();
        });

        it('should return false if no createDate defined', () => {
            const { createdDate, ...rest } = config;
            const entity = new FileBackedHttpMetadataResolver(rest as MetadataResolver);
            expect(entity.getCreationDate()).toBeNull();
        });
    });

    describe('enabled getter', () => {
        it('should return the serviceEnabled attribute', () => {
            const entity = new FileBackedHttpMetadataResolver(config);
            expect(entity.enabled).toBe(config.serviceEnabled);
        });
    });

    describe('serialize method', () => {
        it('should return itself', () => {
            const entity = new FileBackedHttpMetadataResolver(config);
            expect(entity.serialize()).toBe(entity);
        });
    });
});
