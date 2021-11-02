import { metadataFilterProcessor } from '../utility/providerFilterProcessor';
import { DurationOptions } from '../../data';
import { MetadataFilterTypes } from '../../filter';

export const BaseProviderDefinition = {
    schemaPreprocessor: metadataFilterProcessor,
    validator: (data = [], current = { resourceId: null }, group) => {
        const providers = data.filter(p => p.resourceId !== current?.resourceId);
        const names = providers.map(s => s.name);
        const ids = providers.map(s => s.xmlId);

        return (formData, errors) => {

            if (names.indexOf(formData.name) > -1) {
                errors.name.addError('message.name-must-be-unique');
            }

            if (ids.indexOf(formData.xmlId) > -1) {
                errors.xmlId.addError('message.id-unique');
            }

            return errors;
        }
    },
    parser: (changes, base) => {

        const baseFilters = base ? base.metadataFilters.filter(f => MetadataFilterTypes.indexOf(f['@type']) > -1) : [];

        const parsed = (changes.metadataFilters ? ({
            ...changes,
            metadataFilters: [
                ...changes.metadataFilters.filter((filter, filterName) => {
                    if (filter['@type'] === 'RequiredValidUntil') {
                        if (!filter.maxValidityInterval || filter.maxValidityInterval === "") {
                            return false;
                        }
                    }

                    return Object.keys(filter).filter(k => k !== '@type').length > 0;
                }),
                ...baseFilters
            ]
        }) : changes);

        return parsed;
    },
    formatter: (changes, schema) => {
        const filterSchema = schema?.properties?.metadataFilters;
        if (!filterSchema || !changes) {
            return changes;
        }
        
        const formatted = (changes.metadataFilters ? ({
            ...changes,
            metadataFilters: Object.values(filterSchema.items).map(item => {
                const filter = changes.metadataFilters.find(f => f['@type'] === item.$id);
                if (filter) {
                    return filter;
                }
                return {};
            })
        }) : changes);
        return formatted;
    },
    display: (changes) => {
        if (!changes.metadataFilters) {
            return changes;
        }
        return {
            ...changes,
            metadataFilters: {
                ...changes.metadataFilters.reduce((collection, filter) => ({
                    ...collection,
                    [filter['@type']]: filter
                }), {})
            }
        };
    },
    overrideSchema: (schema) => schema,
    uiSchema: {
        name: {
            'ui:help': 'message.must-be-unique'
        },
        enabled: {
            'ui:widget': 'hidden'
        }
    },
    steps: [
        {
            id: 'new',
            label: 'label.select-metadata-provider-type',
            index: 1,
            initialValues: [],
            fields: [
                'name',
                '@type'
            ],
            fieldsets: [
                {
                    type: 'section',
                    class: ['col-12'],
                    fields: [
                        'name',
                        '@type'
                    ]
                }
            ]
        }
    ]
}

export const HttpMetadataResolverAttributesSchema = {
    layout: {
        groups: [
            {
                title: 'label.http-security-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                size: 12,
                fields: [
                    'disregardTLSCertificate'
                ]
            },
            {
                title: 'label.http-connection-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                size: 12,
                fields: [
                    'connectionRequestTimeout',
                    'connectionTimeout',
                    'socketTimeout'
                ]
            },
            {
                title: 'label.http-proxy-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                size: 12,
                fields: [
                    'proxyHost',
                    'proxyPort',
                    'proxyUser',
                    'proxyPassword'
                ]
            },
            {
                title: 'label.http-caching-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-3 mb-4',
                size: 12,
                fields: [
                    'httpCaching',
                    'httpCacheDirectory',
                    'httpMaxCacheEntries',
                    'httpMaxCacheEntrySize'
                ]
            },
            {
                classNames: 'd-none',
                size: 12,
                fields: [
                    'tlsTrustEngineRef',
                    'httpClientSecurityParametersRef',
                    'httpClientRef'
                ]
            }
        ]
    },
    disregardTLSCertificate: {
        'ui:widget': 'radio',
        'ui:options': {
            inline: true
        }
    },
    connectionRequestTimeout: {
        'ui:widget': 'OptionWidget',
        options: DurationOptions,
        'ui:placeholder': 'label.duration'
    },
    connectionTimeout: {
        'ui:widget': 'OptionWidget',
        options: DurationOptions,
        'ui:placeholder': 'label.duration'
    },
    socketTimeout: {
        'ui:widget': 'OptionWidget',
        options: DurationOptions,
        'ui:placeholder': 'label.duration'
    },
    httpClientRef: {
        'ui:widget': 'hidden'
    },
    tlsTrustEngineRef: {
        'ui:widget': 'hidden'
    },
    httpClientSecurityParametersRef: {
        'ui:widget': 'hidden'
    },
    httpMaxCacheEntries: {
        'ui:widget': 'updown'
    },
    httpMaxCacheEntrySize: {
        'ui:widget': 'updown'
    },
    httpCaching: {
        'ui:placeholder': 'label.select-caching-type'
    }
};

export const MetadataFilterPluginsSchema = {
    'ui:title': false,
    items: {
        'ui:options': {
            classNames: 'bg-light border rounded px-4 pt-4 pb-3'
        },
        '@type': {
            'ui:widget': 'hidden'
        },
        retainedRoles: {
            'ui:options': {
                orderable: false
            }
        },
        maxValidityInterval: {
            'ui:widget': 'OptionWidget',
            options: DurationOptions,
            'ui:placeholder': 'label.duration'
        }
    }
};

// 