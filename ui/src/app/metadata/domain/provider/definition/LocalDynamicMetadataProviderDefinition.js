import defaultsDeep from 'lodash/defaultsDeep';

import API_BASE_PATH from "../../../../App.constant";
import { BaseProviderDefinition } from "./BaseProviderDefinition";

export const LocalDynamicMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'LocalDynamicMetadataProvider',
    type: 'LocalDynamicMetadataResolver',
    schema: `${API_BASE_PATH}/ui/MetadataResolver/LocalDynamicMetadataResolver`,
    steps: [
        ...BaseProviderDefinition.steps,
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'sourceDirectory'
            ]
        },
        {
            id: 'dynamic',
            label: 'label.dynamic-attributes',
            index: 3,
            initialValues: [],
            fields: [
                'dynamicMetadataResolverAttributes'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 4,
            initialValues: [],
            fields: []
        }
    ],
    uiSchema: defaultsDeep({
        layout: {
            groups: [
                {
                    sizes: {
                        xs: 12,
                        lg: 8,
                        xxl: 6
                    },
                    classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    sizes: {
                        xs: 12,
                        lg: 8,
                        xxl: 6
                    },
                    fields: [
                        'xmlId',
                        'sourceDirectory'
                    ]
                },
                {
                    sizes: {
                        xs: 12,
                        lg: 8,
                        xxl: 6
                    },
                    fields: [
                        'dynamicMetadataResolverAttributes'
                    ],
                }
            ]
        },
        dynamicMetadataResolverAttributes: {
            refreshDelayFactor: {
                'ui:widget': 'updown',
                'ui:help': 'message.real-number',
                'ui:placeholder': 'label.real-number'
            },
            removeIdleEntityData: {
                'ui:widget': 'radio',
                'ui:options': {
                    inline: true
                }
            },
            minCacheDuration: {
                'ui:placeholder': 'label.duration'
            },
            maxCacheDuration: {
                'ui:placeholder': 'label.duration'
            },
            maxIdleEntityData: {
                'ui:placeholder': 'label.duration'
            },
            cleanupTaskInterval: {
                'ui:placeholder': 'label.duration'
            }
        }
    }, BaseProviderDefinition.uiSchema)
};


export const LocalDynamicMetadataProviderEditor = {
    ...LocalDynamicMetadataProviderWizard,
    uiSchema: defaultsDeep({
        '@type': {
            'ui:readonly': true
        }
    }, LocalDynamicMetadataProviderWizard.uiSchema),
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                '@type',
                'xmlId',
                'sourceDirectory',
                'enabled'
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['LocalDynamicMetadataResolver'], description: 'value.local-dynamic-metadata-provider' }]
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
                        'xmlId',
                        'sourceDirectory',
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
                'dynamicMetadataResolverAttributes'
            ]
        }
    ]
};
