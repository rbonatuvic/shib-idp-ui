import { SourceBase } from './SourceDefinition';

jest.mock('../../../../App.constant', () => ({
    get API_BASE_PATH() {
        return '/';
    }
}));

describe('SourceDefinition', () => {
    describe('parser', () => {
        it('should remove null values', () => {
            expect(SourceBase.parser({
                foo: null,
                bar: 'baz',
                baz: {
                    bar: null
                }
            })).toEqual({bar: 'baz'});
        });
    });

    describe('warnings', () => {
        it('should return warnings based on provided data', () => {
            expect(SourceBase.warnings({
                relyingPartyOverrides: {
                    signAssertion: false,
                    dontSignResponse: true
                }
            })).toEqual({
                'relying-party': [
                    'message.invalid-signing'
                ]
            });
        })

        it('should return no warnings', () => {
            expect(SourceBase.warnings({
                relyingPartyOverrides: {
                    signAssertion: true,
                    dontSignResponse: true
                }
            })).toEqual({});
        })
    });

    describe('bindings', () => {
        it('should allow one assertion consumer service to be default', () => {
            expect(SourceBase.bindings(
                {
                    assertionConsumerServices: [
                        {
                            makeDefault: false
                        },
                        {
                            makeDefault: true
                        }
                    ]
                },
                {
                    assertionConsumerServices: [
                        {
                            makeDefault: true
                        },
                        {
                            makeDefault: true
                        }
                    ]
                }
            )).toEqual({
                assertionConsumerServices: [
                    {
                        makeDefault: true
                    },
                    {
                        makeDefault: false
                    }
                ]
            });
        })

        it('should set x509Certificates available', () => {
            expect(SourceBase.bindings(
                {},
                {
                    securityInfo: {
                        x509Certificates: [
                            {}
                        ]
                    }
                }
            )).toMatchObject({
                securityInfo: {
                    x509Certificates: [
                        {}
                    ],
                    x509CertificateAvailable: true
                }
            });

            expect(SourceBase.bindings(
                {},
                {
                    securityInfo: {
                        x509Certificates: []
                    }
                }
            )).toMatchObject({
                securityInfo: {
                    x509Certificates: [],
                    x509CertificateAvailable: false
                }
            });

            expect(SourceBase.bindings(
                {},
                {}
            )).toEqual({});
        });
    });
});