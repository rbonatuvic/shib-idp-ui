import defaults from 'lodash/defaults';
import merge from 'lodash/merge';
import toNumber  from 'lodash/toNumber';
import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from '../../../App.constant';
import {removeNull} from '../../../core/utility/remove_null';
import { detailedDiff } from 'deep-object-diff';

export const SourceBase = {
    label: 'Metadata Source',
    type: '@MetadataProvider',
    steps: [],
    schema: `${API_BASE_PATH}/ui/MetadataSources`,
    validatorParams: [/*getAllOtherIds*/],

    parser: (data) => removeNull(data, true),

    formatter: (changes, schema) => changes,

    display: (changes) => changes,

    validator: (data = [], current = {id: null}) => {

        const sources = current ? data.filter(s => s.id !== current.id) : data;
        const entityIds = sources.map(s => s.entityId);

        return (formData, errors) => {
            if (entityIds.indexOf(formData.entityId) > -1) {
                errors.entityId.addError('message.id-unique');
            }
            return errors;
        }
    },

    warnings: (data) => {
        let warnings = {};
        if (!data?.relyingPartyOverrides?.signAssertion && data?.relyingPartyOverrides?.dontSignResponse) {
            warnings = {
                ...warnings,
                'relying-party': [
                    ...(warnings.hasOwnProperty('relying-party') ? warnings['relying-party'] : []),
                    'message.invalid-signing'
                ]
            };
        }
        return warnings;
    },

    bindings: (original, formData) => {

        let d = { ...formData };

        if (formData.assertionConsumerServices && formData.assertionConsumerServices.length) {
            const { updated, added } = detailedDiff(original.assertionConsumerServices, formData.assertionConsumerServices);
            const merged = merge(updated, added);
            const changingDefault = Object.keys(merged).some(k => merged[k].hasOwnProperty('makeDefault'));
            if (changingDefault) {
                const settingToTrue = Object.keys(merged).some(k => merged[k].makeDefault === true);
                if (settingToTrue) {
                    d.assertionConsumerServices = d.assertionConsumerServices.map((s, i) => ({
                        ...s,
                        makeDefault: i === toNumber(Object.keys(merged)[0])
                    }));
                }
            }
        }
        return d;
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
                'ui:widget': 'hidden'
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