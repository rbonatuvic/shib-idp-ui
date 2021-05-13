import { metadataFilterProcessor } from './utility/providerFilterProcessor';
import { DurationOptions } from '../data';

export const BaseProviderDefinition = {
    schemaPreprocessor: metadataFilterProcessor,
    parser: (changes) => {
        return (changes.metadataFilters ? ({
            ...changes,
            metadataFilters: [
                ...changes.metadataFilters.filter((filter, filterName) => (
                    Object.keys(filter).filter(k => k !== '@type').length > 0
                ))
            ]
        }) : changes)
    },
    formatter: (changes, schema) => {

        const filterSchema = schema?.properties?.metadataFilters;
        if (!filterSchema) {
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
                ...(changes.metadataFilters || []).reduce((collection, filter) => ({
                    ...collection,
                    [filter['@type']]: filter
                }), {})
            }
        };
    },
    uiSchema: {
        name: {
            'ui:help': 'message.must-be-unique'
        }
    }
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
        }
    }
};

// 