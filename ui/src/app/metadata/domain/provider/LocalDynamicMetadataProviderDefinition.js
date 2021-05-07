import defaultsDeep from 'lodash/defaultsDeep';

import API_BASE_PATH from "../../../App.constant";
import {DurationOptions} from '../data';
import { BaseProviderDefinition } from "./BaseProviderDefinition";

export const LocalDynamicMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'LocalDynamicMetadataProvider',
    type: 'LocalDynamicMetadataResolver',
    schema: '/assets/schema/provider/local-dynamic.schema.json',
    // schema: `${API_BASE_PATH}/ui/MetadataResolver/LocalDynamicMetadataResolver`,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'sourceDirectory'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'xmlId',
                        'sourceDirectory'
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
                'dynamicMetadataResolverAttributes'
            ],
            fieldsets: [
                {
                    type: 'group-lg',
                    class: ['col-12'],
                    fields: [
                        'dynamicMetadataResolverAttributes'
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
                        'sourceDirectory'
                    ]
                },
                {
                    size: 9,
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
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            },
            maxCacheDuration: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            },
            maxIdleEntityData: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            },
            cleanupTaskInterval: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            }
        }
    }, BaseProviderDefinition.uiSchema)
};


export const LocalDynamicMetadataProviderEditor = {
    ...LocalDynamicMetadataProviderWizard,
    uiSchema: defaultsDeep({
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
                'enabled',
                'xmlId',
                'sourceDirectory',
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
                        'enabled',
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
