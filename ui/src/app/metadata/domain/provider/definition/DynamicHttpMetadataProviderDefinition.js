import { BaseProviderDefinition, HttpMetadataResolverAttributesSchema, MetadataFilterPluginsSchema } from './BaseProviderDefinition';
import API_BASE_PATH from '../../../../App.constant';
import defaultsDeep from 'lodash/defaultsDeep';
import { DurationOptions } from '../../data';
import { isValidRegex } from '../../../../core/utility/is_valid_regex';

export const DynamicHttpMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'DynamicHttpMetadataProvider',
    type: 'DynamicHttpMetadataResolver',
    schema: `${API_BASE_PATH}/ui/MetadataResolver/DynamicHttpMetadataResolver`,
    validator: (data = [], current = { resourceId: null }) => {
        const base = BaseProviderDefinition.validator(data, current);
        return (formData, errors) => {
            const errorList = base(formData, errors);
            if (formData?.metadataRequestURLConstructionScheme['@type'] === 'Regex') {
                const { metadataRequestURLConstructionScheme: { match } } = formData;
                const isValid = isValidRegex(match);
                if (!isValid) {
                    errors.metadataRequestURLConstructionScheme.match.addError('message.invalid-regex-pattern');
                }
            }

            return errorList;
        }
    },
    steps: [
        ...BaseProviderDefinition.steps,
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
            fields: []
        }
    ],
    uiSchema: defaultsDeep({
        layout: {
            groups: [
                {
                    size: 8,
                    classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                    fields: [
                        'name',
                        '@type'
                    ]
                },
                {
                    size: 8,
                    fields: [
                        'enabled'
                    ]
                },
                {
                    size: 8,
                    fields: [
                        'xmlId',
                        'requireValidMetadata',
                        'failFastInitialization',
                        'metadataRequestURLConstructionScheme'
                    ]
                },
                {
                    size: 8,
                    fields: [
                        'dynamicMetadataResolverAttributes'
                    ],
                },
                {
                    size: 8,
                    fields: [
                        'metadataFilters'
                    ],
                },
                {
                    size: 8,
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
                'ui:placeholder': 'label.duration',
                visibleIf: {
                    initializeFromPersistentCacheInBackground: true
                }
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
                'requireValidMetadata',
                'failFastInitialization'
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
        '@type': {
            'ui:readonly': true
        }
    }, DynamicHttpMetadataProviderWizard.uiSchema)
};