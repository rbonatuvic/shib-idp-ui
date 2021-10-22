import { BaseProviderDefinition, HttpMetadataResolverAttributesSchema, MetadataFilterPluginsSchema } from './BaseProviderDefinition';
import API_BASE_PATH from '../../../../App.constant';
import defaultsDeep from 'lodash/defaultsDeep';
import isNil from 'lodash/isNil';
import { DurationOptions } from '../../data';
import { isValidRegex } from '../../../../core/utility/is_valid_regex';

function findById(o, id) {
    //Early return
    if (o.$id === id) {
        return o;
    }
    var result, p;
    for (p in o) {
        if (o.hasOwnProperty(p) && typeof o[p] === 'object') {
            result = findById(o[p], id);
            if (result) {
                return result;
            }
        }
    }
    return result;
}


export const DynamicHttpMetadataProviderWizard = {
    ...BaseProviderDefinition,
    label: 'DynamicHttpMetadataProvider',
    type: 'DynamicHttpMetadataResolver',
    schema: `${API_BASE_PATH}/ui/MetadataResolver/DynamicHttpMetadataResolver`,
    overrideSchema: (schema, models) => {

        const includeMatch = models.some(m => !isNil(m?.metadataRequestURLConstructionScheme?.match));

        console.log(models)

        if (includeMatch) {
            return ({
                ...schema,
                properties: {
                    ...schema.properties,
                    metadataRequestURLConstructionScheme: {
                        ...schema.properties.metadataRequestURLConstructionScheme,
                        properties: {
                            ...schema.properties.metadataRequestURLConstructionScheme.properties,
                            match: findById(schema.properties.metadataRequestURLConstructionScheme.dependencies, 'match')
                        }
                    }
                }
            });
        }

        return schema;
    },
    validator: (data = [], current = { resourceId: null }, group, translator) => {
        const base = BaseProviderDefinition.validator(data, current, group);

        const pattern = group?.validationRegex ? new RegExp(group?.validationRegex) : null;

        return (formData, errors) => {
            const errorList = base(formData, errors);
            if (formData?.metadataRequestURLConstructionScheme['@type'] === 'Regex') {
                const { metadataRequestURLConstructionScheme: { match } } = formData;
                const isValid = isValidRegex(match);
                if (!isValid) {
                    errors.metadataRequestURLConstructionScheme.match.addError('message.invalid-regex-pattern');
                }
            }

            if (formData?.metadataRequestURLConstructionScheme['@type'] === 'MetadataQueryProtocol') {
                if (pattern && !pattern.test(formData?.metadataRequestURLConstructionScheme?.content)) {
                    errors?.metadataRequestURLConstructionScheme?.content?.addError(translator('message.group-pattern-fail', { regex: group?.validationRegex }));
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