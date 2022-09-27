import defaults from 'lodash/defaults';
import merge from 'lodash/merge';
import toNumber  from 'lodash/toNumber';
import defaultsDeep from 'lodash/defaultsDeep';
import {removeNull} from '../../../../core/utility/remove_null';
import { detailedDiff } from 'deep-object-diff';
import isNil from 'lodash/isNil';
import { useMetadataSchemaContext } from '../../../hoc/MetadataSchema';

export const SourceBase = {

    parser: (data) => removeNull(data, true),

    formatter: (changes, schema) => changes,

    display: (changes) => changes,

    validator: (data = [], current = {id: null}, group, translator) => {

        const sources = current ? data.filter(s => s.id !== current.id) : data;
        const entityIds = sources.map(s => s.entityId);
        const names = sources.map(s => s.serviceProviderName);
        const pattern = group?.validationRegex ? new RegExp(group?.validationRegex) : null;

        return (formData, errors) => {

            if (entityIds.indexOf(formData.entityId) > -1) {
                errors.entityId.addError('message.id-unique');
            }

            if (names.indexOf(formData.serviceProviderName) > -1) {
                errors.serviceProviderName.addError('message.name-unique');
            }

            if (pattern && !pattern?.test(formData.entityId)) {
                errors.entityId.addError(translator('message.group-pattern-fail', {regex: group?.validationRegex}));
            }

            if (formData?.serviceProviderSsoDescriptor?.nameIdFormats?.length > 0 && !formData.serviceProviderSsoDescriptor.protocolSupportEnum) {
                errors.serviceProviderSsoDescriptor.protocolSupportEnum.addError('message.protocol-support-required')
            }

            if (Array.isArray(formData?.assertionConsumerServices)) {
                formData.assertionConsumerServices.forEach((acs, idx) => {
                    if (pattern && !isNil(acs?.locationUrl) && !pattern?.test(acs.locationUrl)) {
                        errors.assertionConsumerServices[idx].locationUrl.addError(translator('message.group-pattern-fail', { regex: group?.validationRegex }))
                    }
                });
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
                        'protocol',
                        'serviceProviderName',
                        'entityId',
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
                    size: 12,
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
        serviceEnabled: {
            'ui:widget': 'hidden'
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
                            'keyDescriptors'
                        ],
                    }
                ]
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
            keyDescriptors: {
                type: 'certificate',
                "ui:options": {
                    orderable: false
                },
                'ui:order': ['name', 'elementType', 'type', 'value'],
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
    uiSchema: defaultsDeep({
        protocol: {
            'ui:readonly': true
        }
    }, SourceBase.uiSchema),
    steps: [
        {
            index: 1,
            id: 'org-info',
            label: 'label.sp-org-info',
            fields: [
                'protocol',
                'serviceProviderName',
                'entityId',
                'organization',
                'contacts',
                'serviceEnabled'
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
                    fields: []
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
                'protocol',
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
            fields: []
        }
    ]
}

export const sections = [
    { i18nKey: 'organizationInformation', property: 'organization' },
    { i18nKey: 'contacts', property: 'contacts' },
    { i18nKey: 'uiMduiInfo', property: 'mdui' },
    { i18nKey: 'spSsoDescriptorInfo', property: 'serviceProviderSsoDescriptor' },
    { i18nKey: 'logoutEndpoints', property: 'logoutEndpoints' },
    { i18nKey: 'securityDescriptorInfo', property: 'securityInfo' },
    { i18nKey: 'assertionConsumerServices', property: 'assertionConsumerServices' },
    { i18nKey: 'relyingPartyOverrides', property: 'relyingPartyOverrides' },
    { i18nKey: 'attributeRelease', property: 'attributeRelease' }
];

export function useMetadataSourceSections() {
    const schema = useMetadataSchemaContext();

    const keys = Object.keys(schema.properties);
    const properties = sections.map((s) => s.property);
    
    const reduced = keys.reduce(
        (collection, key) => {
            if (properties.indexOf(key) > -1) {
                collection.push(sections.find(s => s.property === key));
            }
            return collection;
        },
        []
    );

    return reduced;
}