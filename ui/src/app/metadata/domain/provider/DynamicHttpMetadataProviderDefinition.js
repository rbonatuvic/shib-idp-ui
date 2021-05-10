// import { metadataFilterProcessor } from './utility/providerFilterProcessor';

import { BaseProviderDefinition, HttpMetadataResolverAttributesSchema, MetadataFilterPluginsSchema } from './BaseProviderDefinition';
// import API_BASE_PATH from '../../../App.constant';
import defaultsDeep from 'lodash/defaultsDeep';
import { DurationOptions } from '../data';

export const DynamicHttpMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'DynamicHttpMetadataProvider',
    type: 'DynamicHttpMetadataResolver',
    schema: '/assets/schema/provider/dynamic-http.schema.json',
    // schema: `${API_BASE_PATH}/ui/MetadataResolver/DynamicHttpMetadataResolver`,
    steps: [
        {
            id: 'common',
            label: 'label.common-attributes',
            index: 2,
            initialValues: [],
            fields: [
                'xmlId',
                'requireValidMetadata',
                'failFastInitialization',
                'metadataRequestURLConstructionScheme'
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
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'summary',
            label: 'label.finished',
            index: 5,
            initialValues: [],
            fields: [
                'enabled'
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
                        'requireValidMetadata',
                        'failFastInitialization',
                        'metadataRequestURLConstructionScheme'
                    ]
                },
                {
                    size: 9,
                    fields: [
                        'dynamicMetadataResolverAttributes'
                    ],
                },
                {
                    size: 9,
                    fields: [
                        'metadataFilters'
                    ],
                },
                {
                    size: 9,
                    fields: [
                        'httpMetadataResolverAttributes'
                    ]
                }
            ]
        },
        requireValidMetadata: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        failFastInitialization: {
            'ui:widget': 'radio',
            'ui:options': {
                inline: true
            }
        },
        dynamicMetadataResolverAttributes: {
            refreshDelayFactor: {
                'ui:widget': 'updown',
                'ui:options': {
                    help: 'message.real-number'
                },
                'ui:placeholder': 'label.real-number'
            },
            removeIdleEntityData: {
                'ui:widget': 'radio',
                'ui:options': {
                    inline: true
                }
            },
            initializeFromPersistentCacheInBackground: {
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
            },
            backgroundInitializationFromCacheDelay: {
                'ui:widget': 'OptionWidget',
                options: DurationOptions,
                'ui:placeholder': 'label.duration'
            }
        },
        metadataFilters: MetadataFilterPluginsSchema,
        httpMetadataResolverAttributes: HttpMetadataResolverAttributesSchema
    }, BaseProviderDefinition.uiSchema),
};

export const DynamicHttpMetadataProviderEditor = {
    ...DynamicHttpMetadataProviderWizard,
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
                'metadataRequestURLConstructionScheme',
                'enabled',
                'requireValidMetadata',
                'failFastInitialization'
            ],
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
                        'metadataRequestURLConstructionScheme',
                        'enabled',
                        'requireValidMetadata',
                        'failFastInitialization'
                    ]
                }
            ],
            override: {
                '@type': {
                    type: 'string',
                    readOnly: true,
                    widget: 'string',
                    oneOf: [{ enum: ['DynamicHttpMetadataResolver'], description: 'value.dynamic-http-metadata-provider' }]
                }
            }
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
            id: 'plugins',
            label: 'label.metadata-filter-plugins',
            index: 4,
            initialValues: [],
            fields: [
                'metadataFilters'
            ]
        },
        {
            id: 'advanced',
            label: 'label.http-settings-advanced',
            index: 4,
            initialValues: [],
            locked: true,
            fields: [
                'httpMetadataResolverAttributes'
            ]
        }
    ],
    uiSchema: defaultsDeep({
    }, DynamicHttpMetadataProviderWizard.uiSchema)
};