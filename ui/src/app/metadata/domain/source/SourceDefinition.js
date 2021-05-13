import { defaults } from 'lodash';
import defaultsDeep from 'lodash/defaultsDeep';
// import API_BASE_PATH from '../../../App.constant';
import {removeNull} from '../../../core/utility/remove_null';


export const SourceBase = {
    label: 'Metadata Source',
    type: '@MetadataProvider',
    steps: [],
    schema: `/assets/schema/source/metadata-source.json`,
    //${API_BASE_PATH}/ui/MetadataSources
    validatorParams: [/*getAllOtherIds*/],

    parser: (data) => removeNull(data, true),

    formatter: (changes, schema) => changes,

    display: (changes) => changes,

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
            protocolSupportEnum: {
                'ui:placeholder': 'label.select-protocol'
            },
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
                            'authenticationRequestsSigned',
                            'wantAssertionsSigned',
                            'x509Certificates'
                        ],
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
            ]
        },
        {
            index: 8,
            id: 'relying-party',
            label: 'label.relying-party',
            fields: [
                'relyingPartyOverrides'
            ]
        },
        {
            index: 9,
            id: 'attribute',
            label: 'label.attribute-release',
            fields: [
                'attributeRelease'
            ]
        }
    ]
};

export const SourceWizard = {
    ...SourceEditor,
    uiSchema: defaults({
        layout: {
            groups: [
                {
                    size: 6,
                    classNames: 'bg-light border rounded px-4 pt-4 pb-3',
                    fields: [
                        'serviceProviderName',
                        'entityId'
                    ]
                },
                {
                    size: 6,
                    fields: [
                        'organization',
                    ],
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
                },
                {
                    size: 6,
                    fields: [
                        'serviceEnabled'
                    ]
                }
            ]
        }
    }, SourceBase.uiSchema),
    steps: [
        {
            index: 1,
            id: 'common',
            label: 'label.name-and-entity-id',
            fields: [
                'serviceProviderName',
                'entityId'
            ]
        },
        {
            index: 2,
            id: 'org-info',
            label: 'label.org-info',
            fields: [
                'organization',
                'contacts'
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
            ]
        },
        {
            index: 8,
            id: 'relying-party',
            label: 'label.relying-party',
            fields: [
                'relyingPartyOverrides'
            ]
        },
        {
            index: 9,
            id: 'attribute',
            label: 'label.attribute-release',
            fields: [
                'attributeRelease'
            ]
        },
        {
            index: 10,
            id: 'summary',
            label: 'label.finished',
            fields: [
                'serviceEnabled'
            ]
        }
    ]
}