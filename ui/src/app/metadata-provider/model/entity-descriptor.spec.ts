import { EntityDescriptor } from './entity-descriptor';
import { MetadataProvider } from './metadata-provider';
describe('Entity Desctiptor construct', () => {

    const config: MetadataProvider = {
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
        createdDate: 'string (date)',
        modifiedDate: 'string (date)',
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
    const entity = new EntityDescriptor(config);

    it('should populate its own values', () => {
        Object.keys(config).forEach(key => {
            expect(entity[key]).toEqual(config[key]);
        });
    });
});
