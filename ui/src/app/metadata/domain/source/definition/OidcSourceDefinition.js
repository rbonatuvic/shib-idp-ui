import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from '../../../../App.constant';
import { SourceBase, SourceEditor, SourceWizard } from './SourceDefinition';

export const OidcSourceBase = defaultsDeep({
    label: 'OIDC Metadata Source',
    type: '@MetadataProvider',
    schema: `${API_BASE_PATH}/ui/MetadataSources?protocol=OIDC`,
}, SourceBase);

export const OidcSourceEditor = defaultsDeep({
    ...SourceEditor,
    uiSchema: defaultsDeep({
        protocol: {
            'ui:readonly': true
        },
        serviceProviderSsoDescriptor: {
            ...SourceBase.uiSchema.serviceProviderSsoDescriptor,
            layout: {
                groups: [
                    {
                        classNames: 'bg-light border rounded px-4 pt-4 mb-4',
                        sizes: {
                            xs: 12,
                            xxl: 9
                        },
                        fields: [
                            'protocolSupportEnum',
                            'nameIdFormats'
                        ],
                    },
                    {
                        sizes: {
                            xs: 12
                        },
                        fields: [
                            'extensions'
                        ],
                    }
                ]
            },
            protocolSupportEnum: {
                "ui:readonly": true
            },
            extensions: {
                OAuthRPExtensions: {
                    layout: {
                        groups: [
                            {
                                classNames: 'col-md-6 col-xs-12',
                                fields: [
                                    'attributes'
                                ],
                            },
                            {
                                classNames: 'border-start col-md-6 col-xs-12',
                                fields: [
                                    'postLogoutRedirectUris',
                                    'defaultAcrValues',
                                    'requestUris',
                                    'audiences'
                                ],
                            },
                        ]
                    },
                    postLogoutRedirectUris: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    defaultAcrValues: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    requestUris: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    audiences: {
                        "ui:options": {
                            orderable: false
                        },
                    }
                }
            }
        }
    }, SourceBase.uiSchema)
}, OidcSourceBase);

export const OidcSourceWizard = defaultsDeep({
    ...SourceWizard,
    uiSchema: defaultsDeep({
        serviceProviderSsoDescriptor: {
            ...SourceBase.uiSchema.serviceProviderSsoDescriptor,
            layout: {
                groups: [
                    {
                        classNames: 'bg-light border rounded px-4 pt-4 mb-4',
                        sizes: {
                            xs: 12,
                            lg: 6
                        },
                        fields: [
                            'protocolSupportEnum',
                            'nameIdFormats'
                        ],
                    },
                    {
                        sizes: {
                            xs: 12
                        },
                        fields: [
                            'extensions'
                        ],
                    }
                ]
            },
            protocolSupportEnum: {
                "ui:readonly": true
            },
            extensions: {
                OAuthRPExtensions: {
                    layout: {
                        groups: [
                            {
                                classNames: 'col-md-6 col-xs-12',
                                fields: [
                                    'attributes'
                                ],
                            },
                            {
                                classNames: 'border-start col-md-6 col-xs-12',
                                fields: [
                                    'postLogoutRedirectUris',
                                    'defaultAcrValues',
                                    'requestUris',
                                    'audiences'
                                ],
                            },
                        ]
                    },
                    postLogoutRedirectUris: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    defaultAcrValues: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    requestUris: {
                        "ui:options": {
                            orderable: false
                        },
                    },
                    audiences: {
                        "ui:options": {
                            orderable: false
                        },
                    }
                }
            }
        }
    }, SourceBase.uiSchema)
}, OidcSourceBase);
