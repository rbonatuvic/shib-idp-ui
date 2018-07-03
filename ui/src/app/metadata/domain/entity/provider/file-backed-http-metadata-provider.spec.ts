import { FileBackedHttpMetadataProvider } from './file-backed-http-metadata-provider';

describe('FileBackedHttmMetadataProvider construct', () => {

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
        createdDate: new Date().toDateString(),
        modifiedDate: new Date().toDateString(),
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

    let entity;

    beforeEach(() => {
        entity = new FileBackedHttpMetadataProvider(config);
    });

    it('should populate its own values', () => {
        Object.keys(config).forEach(key => {
            expect(entity[key]).toEqual(config[key]);
        });
    });

    describe('interface methods', () => {
        it('should return a date object from getCreationDate', () => {
            expect(entity.getCreationDate()).toEqual(new Date(config.createdDate));
        });
    });
});
