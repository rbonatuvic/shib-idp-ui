import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from "../../../App.constant";
import { BaseProviderDefinition } from "./BaseProviderDefinition";
import { DurationOptions } from '../data';

export const FileSystemMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'FilesystemMetadataProvider',
    type: 'FilesystemMetadataResolver',
    schema: '/assets/schema/provider/file-system.schema.json',
    // schema: `${API_BASE_PATH}/ui/MetadataResolver/FilesystemMetadataResolver`,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'metadataFile',
                'doInitialization'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'metadataFile',
                        'doInitialization'
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 4,
            initialValues: [],
            fields: [
                'enabled'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'enabled'
                    ]
                }
            ]
        }
    ],
    uiSchema: defaultsDeep({
        layout: {
            groups: [
                {
                    size: 9,
                    classNames: 'bg-light border rounded px-4 pt-4 pb-1 mb-4',
                    fields: [
                        'name',
                        '@type',
                        'enabled'
                    ]
                },
                {
                    size: 9,
                    fields: [
                        'xmlId',
                        'metadataFile',
                        'doInitialization',
                    ]
                },
                {
                    size: 9,
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        },
        doInitialization: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        reloadableMetadataResolverAttributes: {
            minRefreshDelay: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            },
            maxRefreshDelay: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            },
            refreshDelayFactor: {
                'ui:widget': 'updown',
                'ui:options': {
                    help: 'message.real-number'
                },
                'ui:placeholder': 'label.real-number'
            }
        },
    }, BaseProviderDefinition.uiSchema)
};


export const FileSystemMetadataProviderEditor = {
    ...FileSystemMetadataProviderWizard,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                'xmlId',
                '@type',
                'metadataFile',
                'enabled',
                'doInitialization'
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['FilesystemMetadataResolver'],
                    description: 'value.file-system-metadata-provider' }]
                }
            },
            fieldsets: [
                {
                    type: 'section',
                    class: ['mb-3'],
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'enabled',
                        'xmlId',
                        'metadataFile',
                        'doInitialization'
                    ]
                }
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'reloadableMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'reloadableMetadataResolverAttributes'
                    ]
                }
            ]
        }
    ],
    uiSchema: defaultsDeep({
    }, FileSystemMetadataProviderWizard.uiSchema)
};
