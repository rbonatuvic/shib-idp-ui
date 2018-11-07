import { BaseMetadataProvider } from './base-metadata-provider';

export interface DynamicHttpMetadataProvider extends BaseMetadataProvider {
    id: string;
    metadataURL: string;
    dynamicMetadataResolverAttributes: DynamicMetadataResolverAttributes;
    httpMetadataResolverAttributes: HttpMetadataResolverAttributes;
    maxConnectionsTotal: number;
    maxConnectionsPerRoute: number;
    supportedContentTypes: string[];
}

export interface DynamicMetadataResolverAttributes {
    refreshDelayFactor: number;
    minCacheDuration: string;
    maxCacheDuration: string;
    maxIdleEntityData: string;
    removeIdleEntityData: boolean;
    cleanupTaskInterval: string;

    persistentCacheManagerRef: string;
    persistentCacheManagerDirectory: string;
    persistentCacheKeyGeneratorRef: string;
    initializeFromPersistentCacheInBackground: boolean;
    backgroundInitializationFromCacheDelay: string;
    initializationFromCachePredicateRef: string;
}

export interface HttpMetadataResolverAttributes {
    httpClientRef;
    connectionRequestTimeout: string;
    connectionTimeout: string;
    socketTimeout: string;
    disregardTLSCertificate: boolean;
    tlsTrustEngineRef: string;
    httpClientSecurityParametersRef: string;
    proxyHost: string;
    proxyPort: string;
    proxyUser: string;
    proxyPassword: string;
    httpCaching: HttpCachingType;
    httpCacheDirectory: string;
    httpMaxCacheEntries: number;
    httpMaxCacheEntrySize: number;
}

export enum HttpCachingType {
    NONE = 'none',
    FILE = 'file',
    MEMORY = 'memory'
}
