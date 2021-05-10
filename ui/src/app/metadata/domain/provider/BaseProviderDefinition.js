import { metadataFilterProcessor } from './utility/providerFilterProcessor';
import { DurationOptions } from '../data';

export const BaseProviderDefinition = {
    schemaPreprocessor: metadataFilterProcessor,
    parser: (changes) => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: [
            ...changes.metadataFilters.filter((filter, filterName) => (
                Object.keys(filter).length > 0
            ))
        ]
    }) : changes),
    formatter: (changes) => (changes.metadataFilters ? ({
        ...changes,
        metadataFilters: [
            {},
            {},
            {}
        ]
    }) : changes),
    uiSchema: {
        name: {
            'ui:help': 'message.must-be-unique'
        },
        '@type': {
            'ui:disabled': true
        }
    }
}

export const HttpMetadataResolverAttributesSchema = {
    layout: {
        groups: [
            {
                title: 'label.http-security-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-1 mb-4',
                size: 12,
                fields: [
                    'disregardTLSCertificate'
                ]
            },
            {
                title: 'label.http-connection-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-1 mb-4',
                size: 12,
                fields: [
                    'connectionRequestTimeout',
                    'connectionTimeout',
                    'socketTimeout'
                ]
            },
            {
                title: 'label.http-proxy-attributes',
                classNames: 'bg-light border rounded px-4 pt-4 pb-1 mb-4',
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
                classNames: 'bg-light border rounded px-4 pt-4 pb-1 mb-4',
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
            classNames: 'bg-light border rounded px-4 pt-4 pb-1'
        },
        retainedRoles: {
            'ui:options': {
                orderable: false
            }
        }
    }
};

// 