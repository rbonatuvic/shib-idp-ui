import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from '../../../../App.constant';
import { SourceBase, SourceEditor, SourceWizard } from './SourceDefinition';

export const OidcSourceBase = defaultsDeep({
    label: 'OIDC Metadata Source',
    type: '@MetadataProvider',
    schema: `assets/schema/source/metadata-source-oidc.json`,
    uiSchema: defaultsDeep({
        serviceProviderSsoDescriptor: {
            ...SourceBase.uiSchema.serviceProviderSsoDescriptor,
            layout: {
                groups: [
                    {
                        classNames: 'bg-light border rounded px-4 pt-4 mb-4',
                        size: 6,
                        fields: [
                            'protocolSupportEnum',
                            'nameIdFormats'
                        ],
                    },
                    {
                        size: 12,
                        fields: [
                            'extensions'
                        ],
                    }
                ]
            },
            extensions: {
                OAuthRPExtensions: {
                    layout: {
                        groups: [
                            {
                                fields: [
                                    'postLogoutRedirectUris',
                                    'defaultAcrValues',
                                    'requestUris',
                                    'audience'
                                ],
                            },
                            {
                                fields: [
                                    'attributes'
                                ],
                            }
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
                    audience: {
                        "ui:options": {
                            orderable: false
                        },
                    }
                }
            }
        }
    }, SourceBase.uiSchema)
}, SourceBase);

export const OidcSourceEditor = defaultsDeep({
    ...SourceEditor,
}, OidcSourceBase);

export const OidcSourceWizard = defaultsDeep({
    ...SourceWizard,
}, OidcSourceBase);


