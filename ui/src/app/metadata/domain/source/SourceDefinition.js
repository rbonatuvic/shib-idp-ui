import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from '../../../App.constant';

export const SourceBase = {
    label: 'Metadata Source',
    type: '@MetadataProvider',
    steps: [],
    schema: `/assets/schema/source/metadata-source.json`,
    //${API_BASE_PATH}/ui/MetadataSources
    validatorParams: [/*getAllOtherIds*/],

    bindings: {
        '/securityInfo/x509CertificateAvailable': [
            {
                'input': (event, property) => {
                    let available = !property.value,
                        parent = property.parent,
                        certs = parent.getProperty('x509Certificates');
                    if (available && !certs.value.length) {
                        certs.setValue([
                            {
                                name: '',
                                type: 'both',
                                value: ''
                            }
                        ], true);
                    }

                    if (!available && certs.value.length > 0) {
                        certs.setValue([], true);
                    }
                }
            }
        ],
        '/assertionConsumerServices/*/makeDefault': [
            {
                'input': (event, property) => {
                    let parent = property.parent.parent;
                    let props = parent.properties;
                    props.forEach(prop => {
                        if (prop !== property) {
                            prop.setValue({
                                ...prop.value,
                                makeDefault: false
                            }, false);
                        }
                    });
                }
            }
        ]
    },

    parser: (changes, schema) => {
        if (!schema || !schema.properties) {
            return changes;
        }
        if (schema.properties.hasOwnProperty('organization') && !changes.organization) {
            changes.organization = {};
        }
        return changes;
    },

    formatter: (changes, schema) => {
        return changes;
    },

    getValidators: (entityIdList) => {
        const validators = {
            '/': (value, property, form_current) => {
                let errors;
                // iterate all customer
                Object.keys(value).forEach((key) => {
                    const item = value[key];
                    const validatorKey = `/${key}`;
                    const validator = validators.hasOwnProperty(validatorKey) ? validators[validatorKey] : null;
                    const error = validator ? validator(item, form_current.getProperty(key), form_current) : null;
                    if (error && error.invalidate) {
                        errors = errors || [];
                        errors.push(error);
                    }
                });
                return errors;
            },
            '/entityId': (value, property, form) => {
                const err = entityIdList.indexOf(value) > -1 ? {
                    code: 'INVALID_ID',
                    path: `#${property.path}`,
                    message: 'message.id-unique',
                    params: [value],
                    invalidate: true
                } : null;
                return err;
            },
            '/relyingPartyOverrides': (value, property, form) => {
                if (!value.signAssertion && value.dontSignResponse) {
                    return {
                        code: 'INVALID_SIGNING',
                        path: `#${property.path}`,
                        message: 'message.invalid-signing',
                        params: [value],
                        invalidate: false
                    };
                }
                return null;
            },
            '/serviceProviderSsoDescriptor': (value, property, form) => {
                if (value.nameIdFormats && value.nameIdFormats.length && !value.protocolSupportEnum) {
                    return {
                        code: 'PROTOCOL_SUPPORT_ENUM_REQUIRED',
                        path: `#${property.path}`,
                        message: 'message.protocol-support-required',
                        params: [value],
                        invalidate: true
                    };
                }
                return null;
            }
        };
        return validators;
    },
    uiSchema: {
        'ui:order': ['serviceProviderName', '*'],
        layout: {
            groups: [
                {
                    size: 6,
                    fields: [
                        'serviceProviderName',
                        'entityId',
                        'serviceEnabled',
                        'organization'
                    ]
                },
                {
                    size: 6,
                    fields: [
                        'contacts'
                    ],
                },
                {
                    size: 12,
                    fields: [
                        'mdui'
                    ],
                },
                {
                    size: 6,
                    fields: [
                        'serviceProviderSsoDescriptor'
                    ],
                },
                {
                    size: 6,
                    fields: [
                        'logoutEndpoints'
                    ],
                },
                {
                    size: 12,
                    fields: [
                        'securityInfo'
                    ],
                },
                {
                    size: 6,
                    fields: [
                        'assertionConsumerServices'
                    ],
                },
                {
                    size: 6,
                    fields: [
                        'relyingPartyOverrides'
                    ],
                },
                {
                    size: 6,
                    fields: [
                        'attributeRelease'
                    ],
                }
            ]
        },
        contacts: {
            "ui:options": {
                orderable: false
            },
            type: 'contact',
            "ui:title": false
        },
        attributeRelease: {
            'ui:widget': 'AttributeReleaseWidget'
        },
        logoutEndpoints: {
            type: 'endpoint',
            "ui:options": {
                orderable: false
            },
            "ui:title": false
        },
        assertionConsumerServices: {
            type: 'service',
            "ui:options": {
                orderable: false
            },
            "ui:title": false
        },
        relyingPartyOverrides: {
            nameIdFormats: {
                "ui:options": {
                    orderable: false
                },
                items: {
                    'ui:widget': 'OptionWidget'
                }
            },
            authenticationMethods: {
                "ui:options": {
                    orderable: false
                },
                items: {
                    'ui:widget': 'OptionWidget'
                }
            }
        },
        serviceProviderSsoDescriptor: {
            nameIdFormats: {
                "ui:options": {
                    orderable: false
                },
                items: {
                    'ui:widget': 'OptionWidget'
                }
            }
        },
        securityInfo: {
            layout: {
                groups: [
                    {
                        size: 6,
                        fields: [
                            'x509CertificateAvailable',
                            'authenticationRequestsSigned',
                            'wantAssertionsSigned'
                        ],
                    },
                    {
                        size: 6,
                        fields: [
                            'x509Certificates'
                        ]
                    }
                ]
            },
            x509CertificateAvailable: {
                'ui:widget': 'radio',
                'ui:options': {
                    inline: true
                }
            },
            authenticationRequestsSigned: {
                'ui:widget': 'radio',
                'ui:options': {
                    inline: true
                }
            },
            wantAssertionsSigned: {
                'ui:widget': 'radio',
                'ui:options': {
                    inline: true
                }
            },
            x509Certificates: {
                type: 'certificate',
                "ui:options": {
                    orderable: false
                },
                items: {
                    type: {
                        'ui:widget': 'radio',
                        "ui:description": false,
                        'ui:options': {
                            inline: true
                        }
                    },
                    value: {
                        'ui:widget': 'textarea'
                    }
                }
            }
        },
        mdui: {
            layout: {
                groups: [
                    {
                        size: 6,
                        fields: [
                            "displayName",
                            "informationUrl",
                            "description"
                        ],
                    },
                    {
                        size: 6,
                        fields: [
                            "privacyStatementUrl",
                            "logoUrl",
                            "logoWidth",
                            "logoHeight"
                        ]
                    }
                ]
            },
            description: {
                'ui:widget': 'textarea'
            },
            logoHeight: {
                'ui:widget': 'updown'
            },
            logoWidth: {
                'ui:widget': 'updown'
            }
        }
    }
}


export const SourceEditor = {
    ...SourceBase,
    uiSchema: defaultsDeep({}, SourceBase.uiSchema),
    steps: [
        {
            index: 1,
            id: 'common',
            label: 'label.sp-org-info',
            fields: [
                'serviceProviderName',
                'entityId',
                'serviceEnabled',
                'organization',
                'contacts'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'serviceProviderName',
                        'entityId',
                        'serviceEnabled',
                        'organization'
                    ]
                },
                {
                    type: 'group',
                    fields: [
                        'contacts'
                    ]
                }
            ]
        },
        {
            index: 3,
            id: 'metadata-ui',
            label: 'label.metadata-ui',
            fields: [
                'mdui'
            ]
        },
        {
            index: 4,
            id: 'descriptor-info',
            label: 'label.descriptor-info',
            fields: [
                'serviceProviderSsoDescriptor'
            ]
        },
        {
            index: 5,
            id: 'logout-endpoints',
            label: 'label.logout-endpoints',
            fields: [
                'logoutEndpoints'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'logoutEndpoints'
                    ]
                }
            ]
        },
        {
            index: 6,
            id: 'key-info',
            label: 'label.key-info',
            fields: [
                'securityInfo'
            ]
        },
        {
            index: 7,
            id: 'assertion',
            label: 'label.assertion',
            fields: [
                'assertionConsumerServices'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'assertionConsumerServices'
                    ]
                }
            ]
        },
        {
            index: 8,
            id: 'relying-party',
            label: 'label.relying-party',
            fields: [
                'relyingPartyOverrides'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'relyingPartyOverrides'
                    ]
                }
            ]
        },
        {
            index: 9,
            id: 'attribute',
            label: 'label.attribute-release',
            fields: [
                'attributeRelease'
            ],
            fieldsets: [
                {
                    type: 'group',
                    fields: [
                        'attributeRelease'
                    ]
                }
            ]
        }
    ]
};